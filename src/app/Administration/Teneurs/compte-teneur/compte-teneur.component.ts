// ✅ compte-teneur.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CompteTeneurService } from '../Services/compte-teneur.service';
import { TypeTeneurService } from '../Services/type-teneur.service';


@Component({
  selector: 'app-compte-teneur',
  templateUrl: './compte-teneur.component.html',
  styleUrls: ['./compte-teneur.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class CompteTeneurComponent implements OnInit {
  comptes: any[] = [];
  typeTeneurs: any[] = [];
  compteForm!: FormGroup;
  displayModal = false;
  isEdit = false;
  editedId: number | null = null;
  user: any = JSON.parse(localStorage.getItem('user') || '{}');

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
      code: ['', Validators.required],
      libelle: ['', Validators.required],
      typeTeneur: [null, Validators.required]
    });
  }

  loadComptes(): void {
    this.service.getAll().subscribe(data => this.comptes = data);
  }

  filteredTypeTeneurs: any[] = [];

filterTypeTeneurs(event: any): void {
  const query = event.query.toLowerCase();
  this.filteredTypeTeneurs = this.typeTeneurs.filter(t =>
    t.libelle.toLowerCase().includes(query)
  );
}


  loadTypeTeneurs(): void {
    this.typeTeneurService.getAll().subscribe(data => {
      this.typeTeneurs = data;
      console.log('📦 typeTeneurs :', this.typeTeneurs);
      console.table(this.typeTeneurs);
    });
  }
  
  

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
      code: compte.code,
      libelle: compte.libelle,
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
    const data = {
      code: raw.code,
      libelle: raw.libelle,
      typeTeneur: raw.typeTeneur // this remains the full object
    };
  
    if (this.isEdit && this.editedId !== null) {
      this.service.update(this.editedId, data).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Modifié', detail: 'Compte modifié avec succès' });
        this.displayModal = false;
        this.loadComptes();
      });
    } else {
      this.service.add(data).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Ajouté', detail: 'Compte ajouté avec succès' });
        this.displayModal = false;
        this.loadComptes();
      });
    }
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
    this.service.delete(id).subscribe(
      () => {
        this.comptes = this.comptes.filter(c => c.id !== id);
        this.messageService.add({ severity: 'success', summary: 'Supprimé', detail: 'Compte supprimé avec succès' });
      },
      err => {
        console.error('Erreur suppression:', err);
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
