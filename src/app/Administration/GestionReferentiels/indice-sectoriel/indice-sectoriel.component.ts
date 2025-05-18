import {Component,OnInit,HostListener,ElementRef,ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IndiceSectorielService } from '../Services/indice-sectoriel.service';

@Component({
  selector: 'app-indice-sectoriel',
  templateUrl: './indice-sectoriel.component.html',
  styleUrls: ['./indice-sectoriel.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class IndiceSectorielComponent implements OnInit {
  indices: any[] = [];
  indiceForm!: FormGroup;
  isEdit = false;
  editedId: number | null = null;
  displayModal = false;
  user: any = JSON.parse(localStorage.getItem('user') || '{}');
  filteredGroupes: any[] = [];


  // Filters
  filterCodeIsin = '';
  filterCodeICB = '';
  filterGroupe = '';
  filterMnemonique = '';
  filterLibellefr = '';
  filterLibellear = '';
  filterLibelleen = '';
  filterDesc = '';

  showFilterCodeIsin = false;
  showFilterCodeICB = false;
  showFilterGroupe = false;
  showFilterMnemonique = false;
  showFilterLibellefr = false;
  showFilterLibellear = false;
  showFilterLibelleen = false;
  showFilterDesc = false;

  @ViewChild('codeIsinToggler')      codeIsinToggler!: ElementRef;
  @ViewChild('codeIsinFilter')       codeIsinFilter!: ElementRef;
  @ViewChild('codeICBToggler')       codeICBToggler!: ElementRef;
  @ViewChild('codeICBFilter')        codeICBFilter!: ElementRef;
  @ViewChild('groupeToggler')        groupeToggler!: ElementRef;
  @ViewChild('groupeFilter')         groupeFilter!: ElementRef;
  @ViewChild('mnemoniqueToggler')    mnemoniqueToggler!: ElementRef;
  @ViewChild('mnemoniqueFilter')     mnemoniqueFilter!: ElementRef;
  @ViewChild('libellefrToggler')     libellefrToggler!: ElementRef;
  @ViewChild('libellefrFilter')      libellefrFilter!: ElementRef;
  @ViewChild('libellearToggler')     libellearToggler!: ElementRef;
  @ViewChild('libellearFilter')      libellearFilter!: ElementRef;
  @ViewChild('libelleenToggler')     libelleenToggler!: ElementRef;
  @ViewChild('libelleenFilter')      libelleenFilter!: ElementRef;
  @ViewChild('descToggler')          descToggler!: ElementRef;
  @ViewChild('descFilter')           descFilter!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private svc: IndiceSectorielService,
    private confirmation: ConfirmationService,
    private messageService: MessageService,
    private message: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadIndices();
  }

  private initForm(): void {
    this.indiceForm = this.fb.group({
      codeIsin:   ['', Validators.required],
      codeICB:    ['', Validators.required],
      groupe:     ['', Validators.required],
      mnemonique: ['', Validators.required],
      libellefr:  ['', Validators.required],
      libellear:  ['', Validators.required],
      libelleen:  ['', Validators.required],
      description:['', Validators.required]
    });
  }

  private loadIndices(): void {
    this.svc.getAll().subscribe(data => {
      this.indices = data.sort((a, b) => b.id - a.id);
    });
  }

  get filteredIndices(): any[] {
    return this.indices.filter(i =>
      i.codeIsin.toLowerCase().includes(this.filterCodeIsin.toLowerCase()) &&
      i.codeICB.toLowerCase().includes(this.filterCodeICB.toLowerCase()) &&
      i.groupe.toLowerCase().includes(this.filterGroupe.toLowerCase()) &&
      i.mnemonique.toLowerCase().includes(this.filterMnemonique.toLowerCase()) &&
      i.libellefr.toLowerCase().includes(this.filterLibellefr.toLowerCase()) &&
      i.libellear.toLowerCase().includes(this.filterLibellear.toLowerCase()) &&
      i.libelleen.toLowerCase().includes(this.filterLibelleen.toLowerCase()) &&
      i.description.toLowerCase().includes(this.filterDesc.toLowerCase())
    );
  }

  toggleFilter(col: string): void {
    switch (col) {
      case 'codeIsin':
        this.showFilterCodeIsin = !this.showFilterCodeIsin;
        if (!this.showFilterCodeIsin) this.filterCodeIsin = '';
        break;
      case 'codeICB':
        this.showFilterCodeICB = !this.showFilterCodeICB;
        if (!this.showFilterCodeICB) this.filterCodeICB = '';
        break;
      case 'groupe':
        this.showFilterGroupe = !this.showFilterGroupe;
        if (!this.showFilterGroupe) this.filterGroupe = '';
        break;
      case 'mnemonique':
        this.showFilterMnemonique = !this.showFilterMnemonique;
        if (!this.showFilterMnemonique) this.filterMnemonique = '';
        break;
      case 'libellefr':
        this.showFilterLibellefr = !this.showFilterLibellefr;
        if (!this.showFilterLibellefr) this.filterLibellefr = '';
        break;
      case 'libellear':
        this.showFilterLibellear = !this.showFilterLibellear;
        if (!this.showFilterLibellear) this.filterLibellear = '';
        break;
      case 'libelleen':
        this.showFilterLibelleen = !this.showFilterLibelleen;
        if (!this.showFilterLibelleen) this.filterLibelleen = '';
        break;
      case 'desc':
        this.showFilterDesc = !this.showFilterDesc;
        if (!this.showFilterDesc) this.filterDesc = '';
        break;
    }
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    if (this.showFilterCodeIsin &&
        !this.codeIsinToggler.nativeElement.contains(target) &&
        !this.codeIsinFilter.nativeElement.contains(target)) {
      this.showFilterCodeIsin = false;
    }
    if (this.showFilterCodeICB &&
        !this.codeICBToggler.nativeElement.contains(target) &&
        !this.codeICBFilter.nativeElement.contains(target)) {
      this.showFilterCodeICB = false;
    }
    if (this.showFilterGroupe &&
        !this.groupeToggler.nativeElement.contains(target) &&
        !this.groupeFilter.nativeElement.contains(target)) {
      this.showFilterGroupe = false;
    }
    if (this.showFilterMnemonique &&
        !this.mnemoniqueToggler.nativeElement.contains(target) &&
        !this.mnemoniqueFilter.nativeElement.contains(target)) {
      this.showFilterMnemonique = false;
    }
    if (this.showFilterLibellefr &&
        !this.libellefrToggler.nativeElement.contains(target) &&
        !this.libellefrFilter.nativeElement.contains(target)) {
      this.showFilterLibellefr = false;
    }
    if (this.showFilterLibellear &&
        !this.libellearToggler.nativeElement.contains(target) &&
        !this.libellearFilter.nativeElement.contains(target)) {
      this.showFilterLibellear = false;
    }
    if (this.showFilterLibelleen &&
        !this.libelleenToggler.nativeElement.contains(target) &&
        !this.libelleenFilter.nativeElement.contains(target)) {
      this.showFilterLibelleen = false;
    }
    if (this.showFilterDesc &&
        !this.descToggler.nativeElement.contains(target) &&
        !this.descFilter.nativeElement.contains(target)) {
      this.showFilterDesc = false;
    }
  }

  openModal(): void {
    this.displayModal = true;
    this.isEdit = false;
    this.indiceForm.reset();
  }

  editIndice(i: any): void {
    this.displayModal = true;
    this.isEdit = true;
    this.editedId = i.id;
    this.indiceForm.patchValue(i);
  }

  confirmSave(): void {
    this.confirmation.confirm({
      message: this.isEdit ? 'Confirmer la modification ?' : 'Confirmer l\'ajout ?',
      header:  'Confirmation',
      icon:    'pi pi-check',
      accept:  () => this.saveIndice()
    });
  }

  saveIndice(): void {
    const raw = this.indiceForm.value;
    if (this.isEdit && this.editedId != null) {
      raw.id = this.editedId;
      this.svc.update(this.editedId, raw).subscribe(() => this.afterSave());
    } else {
      this.svc.add(raw).subscribe(() => this.afterSave());
    }
  }

  private afterSave(): void {
    this.message.add({
      severity: this.isEdit ? 'success' : 'success',
      summary:  this.isEdit ? 'Modifié'  : 'Ajouté'
    });
    this.displayModal = false;
    this.loadIndices();
  }

  confirmDelete(id: number): void {
    this.confirmation.confirm({
      message: 'Confirmer la suppression ?',
      header:  'Confirmation',
      icon:    'pi pi-exclamation-triangle',
      accept:  () => this.deleteIndice(id)
    });
  }



  deleteIndice(id: number): void {
    this.svc.delete(id).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Supprimé', detail: 'Groupe supprimé avec succès' });
      this.loadIndices();
    }, err => {
      console.error('Erreur suppression:', err);
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la suppression' });
    });
  }

  logout(): void {
    localStorage.clear();
    window.location.href = '/login';
  }

  getUserImagePath(): string {
    const u = this.user;
    if (!u) return '';
    if (u.image)                   return `/assets/uploads-images/${u.image}`;
    if (u.attributes?.image?.[0])  return `/assets/uploads-images/${u.attributes.image[0]}`;
    if (u.attributes?.picture)     return `/assets/uploads-images/${u.attributes.picture}`;
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
    return `Indice Sectoriel-${ts}.pdf`;
  }
}
