// secteur-international.component.ts
import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SecteurInternationalService } from '../Services/secteur-international.service';

@Component({
  selector: 'app-secteur-international',
  templateUrl: './secteur-international.component.html',
  styleUrls: ['./secteur-international.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class SecteurInternationalComponent implements OnInit {
  items: any[] = [];
  form!: FormGroup;
  isEdit = false;
  editedId: number | null = null;
  displayModal = false;
  user: any = JSON.parse(localStorage.getItem('user') || '{}');


  
  // unified search filter
  searchTerm = '';

  constructor(
    private fb: FormBuilder,
    private service: SecteurInternationalService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadItems();
  }

  initForm(): void {
    this.form = this.fb.group({
      id: [null],
      codeICB: ['', Validators.required],
      codeBVMT: ['', Validators.required],
      codesupersecteur: [''],
      libellefr: ['', Validators.required],
      libellear: [''],
      libelleen: [''],
      description: ['']
    });
  }

  loadItems(): void {
    this.service.getAll().subscribe(data => {
      this.items = data.sort((a, b) => b.id - a.id);
    });
  }
  get filteredItems(): any[] {
    const term = this.searchTerm.toLowerCase();
    return this.items
      .filter(x =>
        x.codeICB.toLowerCase().includes(term) ||
        x.codeBVMT.toLowerCase().includes(term) ||
        (x.codesupersecteur ?? '').toLowerCase().includes(term) ||
        x.libellefr.toLowerCase().includes(term) ||
        (x.libellear ?? '').toLowerCase().includes(term) ||
        (x.libelleen ?? '').toLowerCase().includes(term) ||
        (x.description ?? '').toLowerCase().includes(term)
      )
      .sort((a, b) => b.id - a.id);
  }

  openModal(): void {
    this.isEdit = false;
    this.editedId = null;
    this.form.reset();
    this.displayModal = true;
  }

  editItem(item: any): void {
    this.isEdit = true;
    this.editedId = item.id;
    this.form.patchValue(item);
    this.displayModal = true;
  }

  confirmSave(): void {
    if (this.form.invalid) return;
    this.confirmationService.confirm({
      message: this.isEdit ? 'Confirmer la modification ?' : 'Confirmer l’ajout ?',
      header: 'Confirmation',
      icon: 'pi pi-check',
      accept: () => this.save()
    });
  }

  save(): void {
    const data = this.form.value;
    const op = this.isEdit && this.editedId != null
      ? this.service.update(this.editedId, data)
      : this.service.add(data);

    op.subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: this.isEdit ? 'Modifié' : 'Ajouté',
        detail: this.isEdit ? 'Secteur International modifié avec succès' : 'Secteur International ajouté avec succès'
      });
      this.displayModal = false;
      this.loadItems();
    });
  }

  confirmDelete(id: number): void {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.delete(id),
      reject: () => this.messageService.add({ severity: 'info', summary: 'Annulé' })
    });
  }

  delete(id: number): void {
    this.service.delete(id).subscribe(
      () => {
        this.items = this.items.filter(x => x.id !== id);
        this.messageService.add({ severity: 'success', summary: 'Secteur International Supprimé avec succès' });
      }, err => {
        this.messageService.add({ severity: 'error', summary: 'Erreur' });
      }
    );
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
    return `secteur-international-${ts}.pdf`;
  }
}
