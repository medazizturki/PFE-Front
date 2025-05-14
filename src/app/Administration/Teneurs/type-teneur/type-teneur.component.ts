import { Component, OnInit } from '@angular/core';
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
  displayModal: boolean = false;

  user: any = JSON.parse(localStorage.getItem('user') || '{}');

  constructor(
    private fb: FormBuilder,
    private service: TypeTeneurService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTypes();
    this.getUserImagePath();
  }

  initForm(): void {
    this.typeForm = this.fb.group({
      code: ['', Validators.required],
      libelle: ['', Validators.required]
    });
  }

  loadTypes(): void {
    this.service.getAll().subscribe(data => {
      this.types = data;
    });
  }

  openSignupModal() {
    this.displayModal = true;
    this.isEdit = false;
    this.typeForm.reset();
  }

  closeModal(): void {
    this.displayModal = false;
  }

  editType(type: any): void {
    this.displayModal = true;
    this.isEdit = true;
    this.editedId = type.id;
    this.typeForm.patchValue(type);
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

    if (this.isEdit && this.editedId !== null) {
      this.service.update(this.editedId, data).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Type modifié avec succès' });
        this.displayModal = false;
        this.loadTypes();
      });
    } else {
      this.service.add(data).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Ajouté', detail: 'Type ajouté avec succès' });
        this.displayModal = false;
        this.loadTypes();
      });
    }
  }

  confirmDelete(id: number): void {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer ce Type Teneur ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteType(id),
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Annulé', detail: 'Suppression annulée' });
        this.loadTypes();
      }
    });
  }

  deleteType(id: number): void {
    this.service.delete(id).subscribe(
      () => {
        this.types = this.types.filter(t => t.id !== id);
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Type supprimé avec succès' });
      },
      (err) => {
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
    if (this.user.image) return `/assets/uploads-images/${this.user.image}`;
    if (this.user.attributes?.image?.[0]) return `/assets/uploads-images/${this.user.attributes.image[0]}`;
    if (this.user.attributes?.picture) return `/assets/uploads-images/${this.user.attributes.picture}`;
    return '';
  }
}
