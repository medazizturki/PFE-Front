import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { GroupesService } from '../Services/groupes.service';
import { DevisesService } from '../../Banque/Services/devises.service';

@Component({
  selector: 'app-groupes',
  templateUrl: './groupes.component.html',
  styleUrls: ['./groupes.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class GroupesComponent implements OnInit {
  groupes: any[] = [];
  groupeForm!: FormGroup; 
  isEdit = false;
  editedId: number | null = null;
  displayModal = false;
  user: any = JSON.parse(localStorage.getItem('user') || '{}');
  devises: any[] = [];
  filteredDevises: any[] = [];

  marcheOptions = [
    { label: 'Marché Principal', value: 'Marches_des_Titre_de_capital_Marche_Principale' },
    { label: 'Marché Alternatif', value: 'Marches_des_Titre_de_capital_Marche_Alternatif' },
    { label: 'Marché Obligatoire', value: 'Marches_Obligatoire' },
    { label: 'Marché des Fonds', value: 'Marches_des_Fonds' },
    { label: 'Marché des Sukuk', value: 'Marches_des_Sukuk' },
    { label: 'Marche Hors Cote', value: 'Marche_Hors_Cote' }
  ];
  categorieOptions = [
    { label: 'Titre de Capitale', value: 'Titre_de_Capitale' },
    { label: 'Titre de Créance',  value: 'Titre_de_Creance' },
    { label: 'Sukuk',             value: 'Sukuk' },
    { label: 'Fonds',             value: 'Fonds' },
    { label: 'Autres',            value: 'Autres' }
  ];
  modeOptions = [
    { label: 'Continu', value: 'Continu' },
    { label: 'Fixing',  value: 'Fixing' }
  ];

  // Filters
  filterCode = '';
  filterMarche = '';
  filterCategorie = '';
  filterUnite = '';
  filterDevise = '';
  filterMode = '';
  filterDesc = '';

  showFilterCode = false;
  showFilterMarche = false;
  showFilterCategorie = false;
  showFilterUnite = false;
  showFilterDevise = false;
  showFilterMode = false;
  showFilterDesc = false;

  @ViewChild('codeToggler')    codeToggler!: ElementRef;
  @ViewChild('codeFilter')     codeFilter!: ElementRef;
  @ViewChild('marcheToggler')  marcheToggler!: ElementRef;
  @ViewChild('marcheFilter')   marcheFilter!: ElementRef;
  @ViewChild('catToggler')     catToggler!: ElementRef;
  @ViewChild('catFilter')      catFilter!: ElementRef;
  @ViewChild('uniteToggler')   uniteToggler!: ElementRef;
  @ViewChild('uniteFilter')    uniteFilter!: ElementRef;
  @ViewChild('deviseToggler')  deviseToggler!: ElementRef;
  @ViewChild('deviseFilter')   deviseFilter!: ElementRef;
  @ViewChild('modeToggler')    modeToggler!: ElementRef;
  @ViewChild('modeFilter')     modeFilter!: ElementRef;
  @ViewChild('descToggler')    descToggler!: ElementRef;
  @ViewChild('descFilter')     descFilter!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private groupeServices: GroupesService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private deviseSvc: DevisesService
  ) {}

  ngOnInit(): void {

    this.initForm();
    this.loadGroupes();
    this.loadDevises();
  }



    initForm(): void {
    this.groupeForm = this.fb.group({
      code:           ['', Validators.required],
      marche:         [null, Validators.required],
      categorie:      [null, Validators.required],
      unitecotation:  ['', Validators.required],
      devises:      [null, Validators.required],
      modeCotation:   [null, Validators.required],
      description:    ['', Validators.required]
    });
  }

  private loadGroupes(): void {
    this.groupeServices.getAll().subscribe(data => {
      this.groupes = data.sort((a, b) => b.id - a.id);
    });
  }
  
  loadDevises(): void {
    this.deviseSvc.getAll().subscribe(data => {
      this.devises = data;
      this.filteredDevises = data;
    });
  }

  get filteredGroupes(): any[] {
    return this.groupes.filter(g =>
      g.code
        .toLowerCase()
        .includes(this.filterCode.toLowerCase()) &&
      (g.marche ?? '')
        .toLowerCase()
        .includes(this.filterMarche.toLowerCase()) &&
      (g.categorie ?? '')
        .toLowerCase()
        .includes(this.filterCategorie.toLowerCase()) &&
      g.unitecotation
        .toLowerCase()
        .includes(this.filterUnite.toLowerCase()) &&
      (g.devises?.code ?? '')
        .toLowerCase()
        .includes(this.filterDevise.toLowerCase()) &&
      (g.modeCotation ?? '')
        .toLowerCase()
        .includes(this.filterMode.toLowerCase()) &&
      g.description
        .toLowerCase()
        .includes(this.filterDesc.toLowerCase())
    );
  }

  toggleFilter(field: 'code'|'marche'|'categorie'|'unite'|'devise'|'mode'|'desc'): void {
    switch (field) {
      case 'code':      this.showFilterCode      = !this.showFilterCode;      if (!this.showFilterCode) this.filterCode = ''; break;
      case 'marche':    this.showFilterMarche    = !this.showFilterMarche;    if (!this.showFilterMarche) this.filterMarche = ''; break;
      case 'categorie': this.showFilterCategorie = !this.showFilterCategorie; if (!this.showFilterCategorie) this.filterCategorie = ''; break;
      case 'unite':     this.showFilterUnite     = !this.showFilterUnite;     if (!this.showFilterUnite) this.filterUnite = ''; break;
      case 'devise':    this.showFilterDevise    = !this.showFilterDevise;    if (!this.showFilterDevise) this.filterDevise = ''; break;
      case 'mode':      this.showFilterMode      = !this.showFilterMode;      if (!this.showFilterMode) this.filterMode = ''; break;
      case 'desc':      this.showFilterDesc      = !this.showFilterDesc;      if (!this.showFilterDesc) this.filterDesc = ''; break;
    }
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    if (this.showFilterCode &&
        !this.codeToggler.nativeElement.contains(target) &&
        !this.codeFilter.nativeElement.contains(target)) {
      this.showFilterCode = false;
    }
    if (this.showFilterMarche &&
        !this.marcheToggler.nativeElement.contains(target) &&
        !this.marcheFilter.nativeElement.contains(target)) {
      this.showFilterMarche = false;
    }
    if (this.showFilterCategorie &&
        !this.catToggler.nativeElement.contains(target) &&
        !this.catFilter.nativeElement.contains(target)) {
      this.showFilterCategorie = false;
    }
    if (this.showFilterUnite &&
        !this.uniteToggler.nativeElement.contains(target) &&
        !this.uniteFilter.nativeElement.contains(target)) {
      this.showFilterUnite = false;
    }
    if (this.showFilterDevise &&
        !this.deviseToggler.nativeElement.contains(target) &&
        !this.deviseFilter.nativeElement.contains(target)) {
      this.showFilterDevise = false;
    }
    if (this.showFilterMode &&
        !this.modeToggler.nativeElement.contains(target) &&
        !this.modeFilter.nativeElement.contains(target)) {
      this.showFilterMode = false;
    }
    if (this.showFilterDesc &&
        !this.descToggler.nativeElement.contains(target) &&
        !this.descFilter.nativeElement.contains(target)) {
      this.showFilterDesc = false;
    }
  }


  
  // after:
  filterDevises(event: any): void {
    const q = (event.query || '').toLowerCase();
    this.filteredDevises = this.devises.filter(d =>
      d.code.toLowerCase().includes(q)   // ← use d.code, not d.libelle
    );
  }

  
  openModal(): void {
    this.displayModal = true;
    this.isEdit = false;
    this.groupeForm.reset();
  }

    // ─── Modal / CRUD ────────────────────────────────────────────────────────

  editGroupe(groupe: any): void {
    this.displayModal = true;
    this.isEdit = true;
    this.editedId = groupe.id;
    this.groupeForm.patchValue({
      code:       groupe.code,
      marche:    groupe.marche,
      categorie:    groupe.categorie,
      unitecotation:    groupe.unitecotation,
      modeCotation:    groupe.modeCotation,
      description:    groupe.description,
      devises: this.devises.find(t => t.id === groupe.devises.id)
    });
  }

  confirmSave(): void {
    this.confirmationService.confirm({
      message: this.isEdit ? 'Confirmer la modification ?' : 'Confirmer l\'ajout ?',
      header: 'Confirmation',
      icon: 'pi pi-check',
      accept: () => this.saveGroupe()
    });
  }

  saveGroupe(): void {
    const raw = this.groupeForm.value;
    // build the payload; include `id` when editing
    let payload: any = {
      code:         raw.code,
      marche:       raw.marche,
      categorie:    raw.categorie,
      unitecotation:raw.unitecotation,
      modeCotation: raw.modeCotation,
      description:  raw.description,
      devises:      raw.devises
    };
    if (this.isEdit && this.editedId != null) {
      payload.id = this.editedId;
    }

    const op = this.isEdit
      ? this.groupeServices.update(this.editedId!, payload)
      : this.groupeServices.add(payload);

    op.subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary:  this.isEdit ? 'Modifié' : 'Ajouté',
        detail:   this.isEdit ? 'Groupe modifié avec succès' : 'Groupe ajouté avec succès'
      });
      this.displayModal = false;
      this.loadGroupes();
    });
  }



    confirmDelete(id: number): void {
    this.confirmationService.confirm({
      message: 'Confirmer la suppression ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteGroupes(id)
    });
  }


    deleteGroupes(id: number): void {
    this.groupeServices.delete(id).subscribe(() => {
      this.devises = this.devises.filter(c => c.id !== id);
      this.messageService.add({ severity: 'success', summary: 'Supprimé', detail: 'Groupe supprimé avec succès' });
      this.loadGroupes();
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
    if (!this.user) return '';
    if (this.user.image) return `/assets/uploads-images/${this.user.image}`;
    if (this.user.attributes?.image?.[0]) return `/assets/uploads-images/${this.user.attributes.image[0]}`;
    if (this.user.attributes?.picture) return `/assets/uploads-images/${this.user.attributes.picture}`;
    return '';
  }


  
  /** Appelé depuis le bouton Exporter en PDF */
  generatePDF(): void {
    this.groupeServices.downloadPdf().subscribe(blob => {
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
    return `Groupes-${ts}.pdf`;
  }
}
