// ✅ categorieavoir.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CategorieavoirService } from '../Services/categorieavoir.service';

@Component({
  selector: 'app-categorieavoir',
  templateUrl: './categorieavoir.component.html',
  styleUrls: ['./categorieavoir.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class CategorieavoirComponent implements OnInit {
  categories: any[] = [];
  categorieForm!: FormGroup;
  isEdit = false;
  editedId: number | null = null;
  displayModal = false;

  user: any = JSON.parse(localStorage.getItem('user') || '{}');

  constructor(
    private fb: FormBuilder,
    private service: CategorieavoirService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
    this.getUserImagePath();
  }

  initForm(): void {
    this.categorieForm = this.fb.group({
      codeBVMT: ['', Validators.required],
      codeNSC: ['', Validators.required],
      codeOptique: ['',Validators.required],
      codeTc: ['',Validators.required],
      libellefr: ['', Validators.required],
      libellecourtefr: ['',Validators.required],
      libellear: ['',Validators.required],
      libellecourtear: ['',Validators.required],
      libelleen: ['',Validators.required],
      libellecourteen: ['',Validators.required],
      tauxreductionCTB: [null,Validators.required],
      tauxreductionRUS: [null,Validators.required],
      tauxreductionCEB_ENR: [null,Validators.required],
      tauxreductionRUS_ENR: [null,Validators.required]
    });
  }

  loadCategories(): void {
    this.service.getAll().subscribe(data => this.categories = data);
  }

  openSignupModal(): void {
    this.displayModal = true;
    this.isEdit = false;
    this.categorieForm.reset();
  }

  editCategorie(cat: any): void {
    this.displayModal = true;
    this.isEdit = true;
    this.editedId = cat.id;
    this.categorieForm.patchValue(cat);
  }

  confirmSave(): void {
    if (this.categorieForm.invalid) return;

    this.confirmationService.confirm({
      message: this.isEdit ? 'Confirmer la modification ?' : 'Confirmer l\'ajout ?',
      header: 'Confirmation',
      icon: 'pi pi-check',
      accept: () => this.saveCategorie()
    });
  }

  saveCategorie(): void {
    const data = this.categorieForm.value;
    if (this.isEdit && this.editedId !== null) {
      this.service.update(this.editedId, { ...data, id: this.editedId }).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Catégorie modifiée' });
        this.displayModal = false;
        this.loadCategories();
      });
    } else {
      this.service.add(data).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Ajouté', detail: 'Catégorie ajoutée' });
        this.displayModal = false;
        this.loadCategories();
      });
    }
  }

  confirmDelete(id: number): void {
    this.confirmationService.confirm({
      message: 'Confirmer la suppression ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteCategorie(id)
    });
  }

  deleteCategorie(id: number): void {
    this.service.delete(id).subscribe(() => {
      this.categories = this.categories.filter(c => c.id !== id);
      this.messageService.add({ severity: 'success', summary: 'Supprimé', detail: 'Catégorie supprimée' });
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
}
