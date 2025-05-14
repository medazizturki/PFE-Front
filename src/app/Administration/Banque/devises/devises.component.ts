// src/app/devises/devises.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DevisesService } from '../Services/devises.service';

@Component({
  selector: 'app-devises',
  templateUrl: './devises.component.html',
  styleUrls: ['./devises.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class DevisesComponent implements OnInit {
  devisesList: any[] = [];
  devisesForm!: FormGroup;
  isEdit = false;
  editedId: number | null = null;
  displayModal: boolean = false;

  constructor(
    private fb: FormBuilder,
    private service: DevisesService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDevises();
  }

  initForm(): void {
    this.devisesForm = this.fb.group({
      code: ['', Validators.required],
      libellefr: ['', Validators.required],
      libelleCfr: [''],
      libellear: [''],
      libelleCar: [''],
      libelleen: [''],
      libelleCen: ['']
    });
  }

  loadDevises(): void {
    this.service.getAll().subscribe(data => {
      this.devisesList = data;
    });
  }

  openSignupModal() {
    this.displayModal = true;
    this.isEdit = false;
    this.devisesForm.reset();
  }

  closeModal(): void {
    this.displayModal = false;
  }

  editDevises(devise: any): void {
    this.displayModal = true;
    this.isEdit = true;
    this.editedId = devise.id;
    this.devisesForm.patchValue(devise);
  }

  confirmSaveDevises(): void {
    if (this.devisesForm.invalid) return;

    this.confirmationService.confirm({
      message: this.isEdit ? 'Confirmer la modification ?' : 'Confirmer l’ajout ?',
      header: 'Confirmation',
      icon: 'pi pi-check',
      accept: () => this.saveDevises()
    });
  }

  saveDevises(): void {
    const data = this.devisesForm.value;

    if (this.isEdit && this.editedId !== null) {
      data.id = this.editedId;
      this.service.update(this.editedId, data).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Devise modifiée avec succès' });
        this.displayModal = false;
        this.loadDevises();
      });
    } else {
      this.service.add(data).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Ajouté', detail: 'Devise ajoutée avec succès' });
        this.displayModal = false;
        this.loadDevises();
      });
    }
  }

  confirmDelete(id: number): void {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer cette devise ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteDevises(id),
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Annulé', detail: 'Suppression annulée' });
      }
    });
  }

  deleteDevises(id: number): void {
    this.service.delete(id).subscribe(
      () => {
        this.devisesList = this.devisesList.filter(d => d.id !== id);
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Devise supprimée avec succès' });
      },
      (err) => {
        console.error('Erreur de suppression :', err);
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la suppression' });
      }
    );
  }
}
