import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TMMService } from '../Services/tmm.service';

@Component({
  selector: 'app-tmm',
  templateUrl: './tmm.component.html',
  styleUrls: ['./tmm.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class TMMComponent implements OnInit {
  tmmList: any[] = [];
  tmmForm!: FormGroup;
  isEdit = false;
  editedId: number | null = null;
  displayModal: boolean = false;

  user: any = JSON.parse(localStorage.getItem('user') || '{}');

  constructor(
    private fb: FormBuilder,
    private tmmService: TMMService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchTMMs();
    this.getUserImagePath();
  }

  initForm(): void {
    this.tmmForm = this.fb.group({
      mois: ['', Validators.required],
      tmm: [null, Validators.required]
    });
  }

  fetchTMMs(): void {
    this.tmmService.getAllTMM().subscribe(data => {
      this.tmmList = data;
    });
  }

  openSignupModal() {
    this.displayModal = true;
    this.isEdit = false;
    this.tmmForm.reset();
  }

  closeModal(): void {
    this.displayModal = false;
  }

editTMM(tmm: any): void {
  this.displayModal = true;
  this.isEdit = true;
  this.editedId = tmm.id;

  const formattedDate = tmm.mois ? tmm.mois.split('T')[0] : ''; // 👉 extrait juste la date

  this.tmmForm.patchValue({
    mois: formattedDate,
    tmm: tmm.tmm
  });
}


  confirmSaveTMM(): void {
    if (this.tmmForm.invalid) return;

    this.confirmationService.confirm({
      message: this.isEdit ? 'Confirmer la modification ?' : 'Confirmer l’ajout ?',
      header: 'Confirmation',
      icon: 'pi pi-check',
      accept: () => this.saveTMM()
    });
  }

saveTMM(): void {
  const data = this.tmmForm.value;

  if (this.isEdit && this.editedId !== null) {
    // ✅ Injecter l'ID dans le payload
    data.id = this.editedId;

    this.tmmService.updateTMM(this.editedId, data).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'TMM modifié avec succès' });
      this.displayModal = false;
      this.fetchTMMs();
    });
  } else {
    this.tmmService.addTMM(data).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Ajouté', detail: 'TMM ajouté avec succès' });
      this.displayModal = false;
      this.fetchTMMs();
    });
  }
}


  confirmDelete(id: number): void {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer ce TMM ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteTMM(id),
      reject: () => {
        this.messageService.add({ severity: 'info', summary: 'Annulé', detail: 'Suppression annulée' });
        this.fetchTMMs();
      }
    });
  }

  deleteTMM(id: number): void {
    this.tmmService.deleteTMM(id).subscribe(
      () => {
        this.tmmList = this.tmmList.filter(t => t.id !== id);
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'TMM supprimé avec succès' });
        this.fetchTMMs();
      },
      (err) => {
        console.error('Erreur de suppression :', err);
        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la suppression' });
        this.fetchTMMs();
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
