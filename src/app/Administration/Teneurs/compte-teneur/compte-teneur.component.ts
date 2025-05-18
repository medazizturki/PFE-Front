import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CompteTeneurService } from '../Services/compte-teneur.service';
import { TypeTeneurService }   from '../Services/type-teneur.service';

@Component({
  selector: 'app-compte-teneur',
  templateUrl: './compte-teneur.component.html',
  styleUrls: ['./compte-teneur.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class CompteTeneurComponent implements OnInit {
  comptes: any[] = [];
  typeTeneurs: any[] = [];
  filteredTypeTeneurs: any[] = [];
  compteForm!: FormGroup;
  displayModal = false;
  isEdit = false;
  editedId: number | null = null;
  user: any = JSON.parse(localStorage.getItem('user') || '{}');

  // ─── Filtrage ───────────────────────────────────────────────────────────────
  filterCode = '';
  filterLibelle = '';
  filterTypeTeneur = '';

  showFilterCode = false;
  showFilterLibelle = false;
  showFilterTypeTeneur = false;

  @ViewChild('codeToggler')       codeToggler!: ElementRef;
  @ViewChild('codeFilter')        codeFilter!: ElementRef;
  @ViewChild('libelleToggler')    libelleToggler!: ElementRef;
  @ViewChild('libelleFilter')     libelleFilter!: ElementRef;
  @ViewChild('typeTeneurToggler') typeTeneurToggler!: ElementRef;
  @ViewChild('typeTeneurFilter')  typeTeneurFilter!: ElementRef;

  constructor(
    private service: CompteTeneurService,
    private typeTeneurService: TypeTeneurService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadComptes();
    this.loadTypeTeneurs();
  }

  initForm(): void {
    this.compteForm = this.fb.group({
      code:       ['', Validators.required],
      libelle:    ['', Validators.required],
      typeTeneur: [null, Validators.required]
    });
  }

  loadComptes(): void {
    this.service.getAll().subscribe(data => {
      // newest first
      this.comptes = data.sort((a, b) => b.id - a.id);
    });
  }

  loadTypeTeneurs(): void {
    this.typeTeneurService.getAll().subscribe(data => {
      this.typeTeneurs = data;
      this.filteredTypeTeneurs = data;
    });
  }

  // ─── Filtrage logic ────────────────────────────────────────────────────────
  get filteredComptes(): any[] {
    return this.comptes
      .filter(c =>
        c.code.toLowerCase().includes(this.filterCode.toLowerCase()) &&
        c.libelle.toLowerCase().includes(this.filterLibelle.toLowerCase()) &&
        (c.typeTeneur?.libelle ?? '')
          .toLowerCase()
          .includes(this.filterTypeTeneur.toLowerCase())
      )
      // keep newest on top after filtering
      .sort((a, b) => b.id - a.id);
  }

  toggleFilter(column: 'code' | 'libelle' | 'typeTeneur'): void {
    if (column === 'code') {
      this.showFilterCode = !this.showFilterCode;
      if (!this.showFilterCode) this.filterCode = '';
    } else if (column === 'libelle') {
      this.showFilterLibelle = !this.showFilterLibelle;
      if (!this.showFilterLibelle) this.filterLibelle = '';
    } else {
      this.showFilterTypeTeneur = !this.showFilterTypeTeneur;
      if (!this.showFilterTypeTeneur) this.filterTypeTeneur = '';
    }
  }

  clearFilter(column: 'code' | 'libelle' | 'typeTeneur') {
    if (column === 'code') this.filterCode = '';
    if (column === 'libelle') this.filterLibelle = '';
    if (column === 'typeTeneur') this.filterTypeTeneur = '';
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    if (this.showFilterCode &&
        !this.codeToggler.nativeElement.contains(target) &&
        !this.codeFilter.nativeElement.contains(target)) {
      this.showFilterCode = false;
    }
    if (this.showFilterLibelle &&
        !this.libelleToggler.nativeElement.contains(target) &&
        !this.libelleFilter.nativeElement.contains(target)) {
      this.showFilterLibelle = false;
    }
    if (this.showFilterTypeTeneur &&
        !this.typeTeneurToggler.nativeElement.contains(target) &&
        !this.typeTeneurFilter.nativeElement.contains(target)) {
      this.showFilterTypeTeneur = false;
    }
  }

  filterTypeTeneurs(event: any): void {
    const q = event.query.toLowerCase();
    this.filteredTypeTeneurs = this.typeTeneurs.filter(t =>
      t.libelle.toLowerCase().includes(q)
    );
  }

  // ─── Modal / CRUD ────────────────────────────────────────────────────────
  openModal(): void {
    this.displayModal = true;
    this.isEdit = false;
    this.compteForm.reset();
  }

  editCompte(compte: any): void {
    this.displayModal = true;
    this.isEdit = true;
    this.editedId = compte.id;
    this.compteForm.patchValue({
      code:       compte.code,
      libelle:    compte.libelle,
      typeTeneur: this.typeTeneurs.find(t => t.id === compte.typeTeneur.id)
    });
  }

  confirmSave(): void {
    this.confirmationService.confirm({
      message: this.isEdit ? 'Confirmer la modification ?' : 'Confirmer l\'ajout ?',
      header: 'Confirmation',
      icon: 'pi pi-check',
      accept: () => this.saveCompte()
    });
  }

  saveCompte(): void {
    const raw = this.compteForm.value;
    const data = { code: raw.code, libelle: raw.libelle, typeTeneur: raw.typeTeneur };
    const op = this.isEdit && this.editedId != null
      ? this.service.update(this.editedId, data)
      : this.service.add(data);

    op.subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary:  this.isEdit ? 'Modifié' : 'Ajouté',
        detail:   this.isEdit ? 'Compte modifié avec succès' : 'Compte ajouté avec succès'
      });
      this.displayModal = false;
      this.loadComptes();
    });
  }

  confirmDelete(id: number): void {
    this.confirmationService.confirm({
      message: 'Confirmer la suppression ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteCompte(id)
    });
  }

  deleteCompte(id: number): void {
    this.service.delete(id).subscribe(() => {
      this.comptes = this.comptes.filter(c => c.id !== id);
      this.messageService.add({ severity: 'success', summary: 'Supprimé', detail: 'Compte supprimé avec succès' });
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
    return `comptes-teneur-${ts}.pdf`;
  }
}
