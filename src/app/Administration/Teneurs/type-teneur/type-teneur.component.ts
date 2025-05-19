import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TypeTeneurService } from '../Services/type-teneur.service';

@Component({
  selector: 'app-type-teneur',
  templateUrl: './type-teneur.component.html',
  styleUrls: ['./type-teneur.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class TypeTeneurComponent implements OnInit {
  types: any[] = [];
  typeForm!: FormGroup;
  isEdit = false;
  editedId: number | null = null;
  displayModal = false;
  user: any = JSON.parse(localStorage.getItem('user') || '{}');

  searchTerm = '';
  

  constructor(
    private fb: FormBuilder,
    private service: TypeTeneurService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTypes();
  }

  initForm(): void {
    this.typeForm = this.fb.group({
      id:      [null],
      code:    ['', Validators.required],
      libelle: ['', Validators.required]
    });
  }


  
  loadTypes(): void {
    this.service.getAll().subscribe(data => {
      this.types = data.sort((a, b) => b.id - a.id);
    });
  }

    get filteredTypes(): any[] {
    const term = this.searchTerm.toLowerCase();
    return this.types.filter(t =>
      t.code.toLowerCase().includes(term) ||
      t.libelle.toLowerCase().includes(term)
    );
  }


  openSignupModal(): void {
    this.isEdit = false;
    this.editedId = null;
    this.typeForm.reset();
    this.displayModal = true;
  }

  editType(type: any): void {
    this.isEdit = true;
    this.editedId = type.id;
    this.typeForm.patchValue(type);
    this.displayModal = true;
  }

  confirmSaveType(): void {
    if (this.typeForm.invalid) return;
    this.confirmationService.confirm({
      message: this.isEdit ? 'Confirmer la modification ?' : 'Confirmer l’ajout ?',
      header: 'Confirmation',
      icon: 'pi pi-check',
      accept: () => this.saveType()
    });
  }

  saveType(): void {
    const data = this.typeForm.value;
    const op = this.isEdit && this.editedId != null
      ? this.service.update(this.editedId, data)
      : this.service.add(data);

    op.subscribe(() => {
      this.messageService.add({
        severity: 'success',
        summary: this.isEdit ? 'Modifié' : 'Ajouté',
        detail: this.isEdit ? 'Type modifié avec succès' : 'Type ajouté avec succès'
      });
      this.displayModal = false;
      this.loadTypes();
    });
  }

  confirmDelete(id: number): void {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer ce Type Teneur ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteType(id),
      reject: () => this.messageService.add({ severity: 'info', summary: 'Annulé', detail: 'Suppression annulée' })
    });
  }

  deleteType(id: number): void {
    this.service.delete(id).subscribe(
      () => {
        this.types = this.types.filter(t => t.id !== id);
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Type supprimé' });
      },
      err => {
        console.error('Erreur de suppression :', err);
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la suppression' });
      }
    );
  }

  logout(): void {
    localStorage.clear();
    window.location.href = '/login';
  }

  getUserImagePath(): string {
    if (!this.user) return '';
    if (this.user.image)                  return `/assets/uploads-images/${this.user.image}`;
    if (this.user.attributes?.image?.[0]) return `/assets/uploads-images/${this.user.attributes.image[0]}`;
    if (this.user.attributes?.picture)    return `/assets/uploads-images/${this.user.attributes.picture}`;
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
    return `types-teneur-${ts}.pdf`;
  }
}
