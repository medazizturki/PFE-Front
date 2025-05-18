import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommisionHorsElecService } from '../Services/commision-hors-elec.service';

@Component({
  selector: 'app-commision-hors-elec',
  templateUrl: './commision-hors-elec.component.html',
  styleUrls: ['./commision-hors-elec.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class CommisionHorsElecComponent implements OnInit {
  commissions: any[] = [];
  commissionForm!: FormGroup;
  isEdit = false;
  editedId: number | null = null;
  displayModal = false;
  user: any = JSON.parse(localStorage.getItem('user') || '{}');

  // ─── Filters ────────────────────────────────────────────────────────────────
  filterTitre   = '';
  filterType    = '';
  filterRate    = '';
  filterMinimum = '';
  filterMaximum = '';

  showFilterTitre   = false;
  showFilterType    = false;
  showFilterRate    = false;
  showFilterMinimum = false;
  showFilterMaximum = false;

  @ViewChild('titreToggler')   titreToggler!: ElementRef;
  @ViewChild('titreFilter')    titreFilter!: ElementRef;
  @ViewChild('typeToggler')    typeToggler!: ElementRef;
  @ViewChild('typeFilter')     typeFilter!: ElementRef;
  @ViewChild('rateToggler')    rateToggler!: ElementRef;
  @ViewChild('rateFilter')     rateFilter!: ElementRef;
  @ViewChild('minToggler')     minToggler!: ElementRef;
  @ViewChild('minFilter')      minFilter!: ElementRef;
  @ViewChild('maxToggler')     maxToggler!: ElementRef;
  @ViewChild('maxFilter')      maxFilter!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private service: CommisionHorsElecService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCommissions();
  }

  initForm(): void {
    this.commissionForm = this.fb.group({
      titre:   ['', Validators.required],
      type:    ['', Validators.required],
      rate:    [null, Validators.required],
      minimum: [null, Validators.required],
      maximum: [null, Validators.required]
    });
  }

  loadCommissions(): void {
    this.service.getAll().subscribe(data => {
      // newest first
      this.commissions = data.sort((a, b) => b.id - a.id);
    });
  }

  // ─── Filtered getter ──────────────────────────────────────────────────────
  get filteredCommissions(): any[] {
    return this.commissions.filter(c => {
      const titre   = (c.titre   || '').toLowerCase();
      const type    = (c.type    || '').toLowerCase();
      const rate    = String(c.rate);
      const minimum = String(c.minimum);
      const maximum = String(c.maximum);

      const okTitre   = !this.filterTitre   || titre.includes(this.filterTitre.toLowerCase());
      const okType    = !this.filterType    || type.includes(this.filterType.toLowerCase());
      const okRate    = !this.filterRate    || rate.includes(this.filterRate);
      const okMin     = !this.filterMinimum || minimum.includes(this.filterMinimum);
      const okMax     = !this.filterMaximum || maximum.includes(this.filterMaximum);

      return okTitre && okType && okRate && okMin && okMax;
    });
  }

  // ─── Toggle Filters ───────────────────────────────────────────────────────
  toggleFilter(col: 'titre'|'type'|'rate'|'min'|'max'): void {
    switch(col) {
      case 'titre':
        this.showFilterTitre = !this.showFilterTitre;
        if (!this.showFilterTitre) this.filterTitre = '';
        break;
      case 'type':
        this.showFilterType = !this.showFilterType;
        if (!this.showFilterType) this.filterType = '';
        break;
      case 'rate':
        this.showFilterRate = !this.showFilterRate;
        if (!this.showFilterRate) this.filterRate = '';
        break;
      case 'min':
        this.showFilterMinimum = !this.showFilterMinimum;
        if (!this.showFilterMinimum) this.filterMinimum = '';
        break;
      case 'max':
        this.showFilterMaximum = !this.showFilterMaximum;
        if (!this.showFilterMaximum) this.filterMaximum = '';
        break;
    }
  }

  // ─── Close on Outside Click ───────────────────────────────────────────────
  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    if (this.showFilterTitre &&
        !this.titreToggler.nativeElement.contains(target) &&
        !this.titreFilter.nativeElement.contains(target)) {
      this.showFilterTitre = false;
    }
    if (this.showFilterType &&
        !this.typeToggler.nativeElement.contains(target) &&
        !this.typeFilter.nativeElement.contains(target)) {
      this.showFilterType = false;
    }
    if (this.showFilterRate &&
        !this.rateToggler.nativeElement.contains(target) &&
        !this.rateFilter.nativeElement.contains(target)) {
      this.showFilterRate = false;
    }
    if (this.showFilterMinimum &&
        !this.minToggler.nativeElement.contains(target) &&
        !this.minFilter.nativeElement.contains(target)) {
      this.showFilterMinimum = false;
    }
    if (this.showFilterMaximum &&
        !this.maxToggler.nativeElement.contains(target) &&
        !this.maxFilter.nativeElement.contains(target)) {
      this.showFilterMaximum = false;
    }
  }

  // ─── Modal / CRUD (unchanged) ─────────────────────────────────────────────
  openSignupModal() {
    this.displayModal = true;
    this.isEdit = false;
    this.commissionForm.reset();
  }

  editCommission(c: any): void {
    this.displayModal = true;
    this.isEdit = true;
    this.editedId = c.id;
    this.commissionForm.patchValue(c);
  }

  confirmSave(): void {
    if (this.commissionForm.invalid) return;
    this.confirmationService.confirm({
      message: this.isEdit ? 'Confirmer la modification ?' : 'Confirmer l’ajout ?',
      header: 'Confirmation',
      icon: 'pi pi-check',
      accept: () => this.saveCommission()
    });
  }

  saveCommission(): void {
    const data = this.commissionForm.value;
    if (this.isEdit && this.editedId != null) {
      (data as any).id = this.editedId;
      this.service.update(this.editedId, data).subscribe(() => {
        this.messageService.add({ severity:'success', summary:'Succès', detail:'Commission modifiée avec succès' });
        this.displayModal = false; this.loadCommissions();
      });
    } else {
      this.service.add(data).subscribe(() => {
        this.messageService.add({ severity:'success', summary:'Ajouté', detail:'Commission ajoutée avec succès' });
        this.displayModal = false; this.loadCommissions();
      });
    }
  }

  confirmDelete(id: number): void {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer cette commission ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteCommission(id),
      reject: () => this.loadCommissions()
    });
  }

  deleteCommission(id: number): void {
    this.service.delete(id).subscribe(
      () => {
        this.commissions = this.commissions.filter(c => c.id !== id);
        this.messageService.add({ severity:'success', summary:'Succès', detail:'Commission supprimée avec succès' });
      },
      err => {
        console.error('Erreur :', err);
        this.messageService.add({ severity:'error', summary:'Erreur', detail:'Échec de la suppression' });
      }
    );
  }

  logout(): void {
    localStorage.clear();
    window.location.href = '/login';
  }

  getUserImagePath(): string {
    if (!this.user) return '';
    if (this.user.image)                   return `/assets/uploads-images/${this.user.image}`;
    if (this.user.attributes?.image?.[0])  return `/assets/uploads-images/${this.user.attributes.image[0]}`;
    if (this.user.attributes?.picture)     return `/assets/uploads-images/${this.user.attributes.picture}`;
    return '';
  }

  
  /** Appelé depuis le bouton Exporter en PDF */
  generatePDF(): void {
    this.service.downloadPdf().subscribe(blob => {
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
    return `Commision Hors Electronique-${ts}.pdf`;
  }
}
