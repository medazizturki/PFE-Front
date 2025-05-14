// ✅ commission-elec.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommissionElecService } from '../Services/commission-elec.service';

@Component({
  selector: 'app-commission-elec',
  templateUrl: './commission-elec.component.html',
  styleUrls: ['./commission-elec.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class CommissionElecComponent implements OnInit {
  commissions: any[] = [];
  commissionForm!: FormGroup;
  displayModal = false;
  isEdit = false;
  editedId: number | null = null;

  user: any = JSON.parse(localStorage.getItem('user') || '{}');

  constructor(
    private fb: FormBuilder,
    private service: CommissionElecService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCommissions();
  }

  initForm(): void {
    this.commissionForm = this.fb.group({
      groupe: ['', Validators.required],
      rang: [null, Validators.required],
      tauxCTB: [null, Validators.required],
      valeurmaxCTB: [null, Validators.required],
      valeurminCTB: [null, Validators.required],
      tauxRUS: [null, Validators.required],
      valeurmaxRUS: [null, Validators.required],
      valeurminRUS: [null, Validators.required]
    });
  }

  loadCommissions(): void {
    this.service.getAll().subscribe(data => this.commissions = data);
  }

  openSignupModal(): void {
    this.displayModal = true;
    this.isEdit = false;
    this.commissionForm.reset();
  }

  editCommission(item: any): void {
    this.displayModal = true;
    this.isEdit = true;
    this.editedId = item.id;
    this.commissionForm.patchValue(item);
  }

  confirmSave(): void {
    if (this.commissionForm.invalid) return;

    this.confirmationService.confirm({
      message: this.isEdit ? 'Confirmer la modification ?' : 'Confirmer l\'ajout ?',
      header: 'Confirmation',
      icon: 'pi pi-check',
      accept: () => this.saveCommission()
    });
  }

  saveCommission(): void {
    const data = this.commissionForm.value;

    if (this.isEdit && this.editedId !== null) {
      const payload = { ...data, id: this.editedId };
      this.service.update(this.editedId, payload).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Commission modifiée' });
        this.displayModal = false;
        this.loadCommissions();
      });
    } else {
      this.service.add(data).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Ajouté', detail: 'Commission ajoutée' });
        this.displayModal = false;
        this.loadCommissions();
      });
    }
  }

  confirmDelete(id: number): void {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer cette Commission ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteCommission(id)
    });
  }

  deleteCommission(id: number): void {
    this.service.delete(id).subscribe(() => {
      this.commissions = this.commissions.filter(c => c.id !== id);
      this.messageService.add({ severity: 'success', summary: 'Supprimé', detail: 'Commission supprimée' });
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