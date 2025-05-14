// ✅ commision-hors-elec.component.ts
import { Component, OnInit } from '@angular/core';
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
  displayModal: boolean = false;
  user: any = JSON.parse(localStorage.getItem('user') || '{}');

  constructor(
    private fb: FormBuilder,
    private service: CommisionHorsElecService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCommissions();
    this.getUserImagePath();
  }

  initForm(): void {
    this.commissionForm = this.fb.group({
      titre: ['', Validators.required],
      type: ['', Validators.required],
      rate: [null, Validators.required],
      minimum: [null, Validators.required],
      maximum: [null, Validators.required]
    });
  }

  loadCommissions(): void {
    this.service.getAll().subscribe(data => {
      this.commissions = data;
    });
  }

  openSignupModal() {
    this.displayModal = true;
    this.isEdit = false;
    this.commissionForm.reset();
  }

  closeModal(): void {
    this.displayModal = false;
  }

  editCommission(commission: any): void {
    this.displayModal = true;
    this.isEdit = true;
    this.editedId = commission.id;
    this.commissionForm.patchValue(commission);
  }

  confirmSave(): void {
    if (this.commissionForm.invalid) return;

    this.confirmationService.confirm({
      message: this.isEdit ? 'Confirmer la modification ?' : 'Confirmer l\u2019ajout ?',
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
        this.messageService.add({ severity: 'success', summary: 'Succ\u00e8s', detail: 'Commission modifi\u00e9e avec succ\u00e8s' });
        this.displayModal = false;
        this.loadCommissions();
      });
    } else {
      this.service.add(data).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Ajout\u00e9', detail: 'Commission ajout\u00e9e avec succ\u00e8s' });
        this.displayModal = false;
        this.loadCommissions();
      });
    }
  }

  confirmDelete(id: number): void {
    this.confirmationService.confirm({
      message: '\u00cates-vous s\u00fbr de vouloir supprimer cette commission ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteCommission(id),
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Annul\u00e9', detail: 'Suppression annul\u00e9e' });
        this.loadCommissions();
      }
    });
  }

  deleteCommission(id: number): void {
    this.service.delete(id).subscribe(
      () => {
        this.commissions = this.commissions.filter(c => c.id !== id);
        this.messageService.add({ severity: 'success', summary: 'Succ\u00e8s', detail: 'Commission supprim\u00e9e avec succ\u00e8s' });
      },
      (err) => {
        console.error('Erreur de suppression :', err);
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: '\u00c9chec de la suppression' });
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
