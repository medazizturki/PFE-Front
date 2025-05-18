import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NatureReferentielsService } from '../Services/nature-referentiels.service';
import { GroupesService }            from '../Services/groupes.service';

@Component({
  selector: 'app-nature-referentiels',
  templateUrl: './nature-referentiels.component.html',
  styleUrls: ['./nature-referentiels.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class NatureReferentielsComponent implements OnInit {
  items: any[]           = [];
  form!: FormGroup;
  isEdit = false;
  editedId: number | null = null;
  displayModal = false;

  user: any = JSON.parse(localStorage.getItem('user') || '{}');
  groupes: any[]         = [];
  filteredGroupes: any[] = [];

  /** table filters **/
  filterCodeBvmt = '';
  filterLibelle  = '';
  filterGroupe   = '';
  filterDesc     = '';

  showFilterCodeBvmt = false;
  showFilterLibelle = false;
  showFilterGroupe  = false;
  showFilterDesc    = false;

  @ViewChild('codeToggler')     codeToggler!: ElementRef;
  @ViewChild('codeFilter')      codeFilter!: ElementRef;
  @ViewChild('libelleToggler')  libelleToggler!: ElementRef;
  @ViewChild('libelleFilter')   libelleFilter!: ElementRef;
  @ViewChild('groupeToggler')   groupeToggler!: ElementRef;
  @ViewChild('groupeFilter')    groupeFilter!: ElementRef;
  @ViewChild('descToggler')     descToggler!: ElementRef;
  @ViewChild('descFilter')      descFilter!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private svc: NatureReferentielsService,
    private grpSvc: GroupesService,
    private confirmation: ConfirmationService,
    private message: MessageService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      codeBvmt:    ['', [Validators.required]],
      libelle:     ['', [Validators.required]],
      groupes:     [null, [Validators.required]],
      libellefr:   [''],
      libellear:   [''],
      libelleen:   [''],
      description: ['', [Validators.required]]
    });

    this.load();
    this.loadGroupes();
  }

  private load() {
    this.svc.getAll().subscribe(data => {
      this.items = data.sort((a, b) => b.id - a.id);
    });
  }

  private loadGroupes() {
    this.grpSvc.getAll().subscribe(data => {
      this.groupes = data;
      this.filteredGroupes = data;
    });
  }

  /** Autocomplete suggester **/
  filterGroupes(event: any) {
    const q = (event.query || '').toLowerCase();
    this.filteredGroupes = this.groupes.filter(g =>
      g.code.toLowerCase().includes(q)
    );
  }

  /** Table filtering **/
  get filteredItems() {
    return this.items.filter(x =>
      x.codeBvmt.toLowerCase().includes(this.filterCodeBvmt.toLowerCase()) &&
      x.libelle.toLowerCase().includes(this.filterLibelle.toLowerCase()) &&
      (x.groupes?.code ?? '').toLowerCase().includes(this.filterGroupe.toLowerCase()) &&
      x.description.toLowerCase().includes(this.filterDesc.toLowerCase())
    );
  }

  toggleFilter(col: string) {
    switch (col) {
      case 'code':    this.showFilterCodeBvmt = !this.showFilterCodeBvmt; if (!this.showFilterCodeBvmt) this.filterCodeBvmt = ''; break;
      case 'libelle': this.showFilterLibelle = !this.showFilterLibelle; if (!this.showFilterLibelle) this.filterLibelle  = ''; break;
      case 'groupe':  this.showFilterGroupe  = !this.showFilterGroupe;  if (!this.showFilterGroupe)  this.filterGroupe   = ''; break;
      case 'desc':    this.showFilterDesc    = !this.showFilterDesc;    if (!this.showFilterDesc)    this.filterDesc     = ''; break;
    }
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    if (this.showFilterCodeBvmt &&
        !this.codeToggler.nativeElement.contains(target) &&
        !this.codeFilter.nativeElement.contains(target)) {
      this.showFilterCodeBvmt = false;
    }
    if (this.showFilterLibelle &&
        !this.libelleToggler.nativeElement.contains(target) &&
        !this.libelleFilter.nativeElement.contains(target)) {
      this.showFilterLibelle = false;
    }
    if (this.showFilterGroupe &&
        !this.groupeToggler.nativeElement.contains(target) &&
        !this.groupeFilter.nativeElement.contains(target)) {
      this.showFilterGroupe = false;
    }
    if (this.showFilterDesc &&
        !this.descToggler.nativeElement.contains(target) &&
        !this.descFilter.nativeElement.contains(target)) {
      this.showFilterDesc = false;
    }
  }

  openModal() {
    this.displayModal = true;
    this.isEdit       = false;
    this.form.reset();
  }

  edit(item: any) {
    this.displayModal = true;
    this.isEdit       = true;
    this.editedId     = item.id;
    this.form.patchValue(item);
  }

  confirmSave() {
    this.confirmation.confirm({
      message: this.isEdit ? 'Confirm update?' : 'Confirm add?',
      icon: 'pi pi-check',
      accept: () => this.save()
    });
  }

  save() {
    // extract the raw values
    const raw = this.form.value;

    // make sure the payload only has { groupes: { id: ... } } not the whole object
    const payload: any = {
      codeBvmt:    raw.codeBvmt,
      libelle:     raw.libelle,
      groupes:     raw.groupes,
      libellefr:   raw.libellefr,
      libellear:   raw.libellear,
      libelleen:   raw.libelleen,
      description: raw.description
    };

    if (this.isEdit && this.editedId != null) {
      payload.id = this.editedId;
      this.svc.update(this.editedId, payload).subscribe(() => this.afterSave());
    } else {
      this.svc.add(payload).subscribe(() => this.afterSave());
    }
  }

  private afterSave() {
    this.message.add({
      severity: 'success',
      summary: this.isEdit ? 'Updated' : 'Added'
    });
    this.displayModal = false;
    this.load();
  }

  confirmDelete(id: number) {
    this.confirmation.confirm({
      message: 'Confirm delete?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteNature(id)
    });
  }

    deleteNature(id: number): void {
    this.svc.delete(id).subscribe(() => {
      this.groupes = this.groupes.filter(c => c.id !== id);
      this.message.add({ severity: 'success', summary: 'Supprimé', detail: 'Nature supprimé avec succès' });
      this.load();
    }, err => {
      console.error('Erreur suppression:', err);
      this.message.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la suppression' });
    });
  }
  logout(): void {
    localStorage.clear();
    window.location.href = '/login';
  }

  getUserImagePath(): string {
    if (!this.user) return '';
    if (this.user.image) return `/assets/uploads-images/${this.user.image}`;
    if (this.user.attributes?.image?.[0]) return `/assets/uploads-images/${this.user.attributes.image[0]}`;
    if (this.user.attributes?.picture) return `/assets/uploads-images/${this.user.attributes.picture}`;
    return '';
  }

  
  /** Appelé depuis le bouton Exporter en PDF */
  generatePDF(): void {
    this.svc.downloadPdf().subscribe(blob => {
      // Créer un URL temporaire
      const url = window.URL.createObjectURL(blob);
      // Créer un <a> pour forcer le téléchargement
      const a = document.createElement('a');
      a.href = url;
      // Vous pouvez adapter le nom si besoin
      a.download = this.makeFileName();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Libérer la mémoire
      window.URL.revokeObjectURL(url);
    });
  }

  /** Génère un nom de fichier horodaté (sans caractères interdits) */
  private makeFileName(): string {
    const now = new Date();
    // format ISO sans ms, remplacer ":" par "." pour Windows
    const ts = now.toISOString().slice(0,19).replace(/:/g, '.');
    return `Nature Referentiel-${ts}.pdf`;
  }
}
