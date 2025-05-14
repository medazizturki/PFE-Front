// src/app/taux-charge/taux-charge.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TauxChargeService } from '../Services/taux-charge.service';
import { DevisesService } from '../Services/devises.service';

@Component({
  selector: 'app-taux-charge',
  templateUrl: './taux-charge.component.html',
  styleUrls: ['./taux-charge.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class TauxChargeComponent implements OnInit {
  tauxList: any[] = [];
  devisesList: any[] = [];
  filteredDevises: any[] = [];
  tauxForm!: FormGroup;
  displayModal = false;
  isEdit = false;
  editedId: number | null = null;
  user: any = JSON.parse(localStorage.getItem('user') || '{}');

  constructor(
    private tauxService: TauxChargeService,
    private devisesService: DevisesService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTaux();
    this.loadDevises();
  }

  initForm(): void {
    this.tauxForm = this.fb.group({
      date: ['', Validators.required],
      value: [null, Validators.required],
      variationAnnuelle: [null, Validators.required],
      devises: [null, Validators.required]
    });
  }

loadTaux(): void {
  this.tauxService.getAll().subscribe({
    next: (data) => {
      this.tauxList = data;
      console.log('✅ Taux reçus dans Angular :', data);
    },
    error: (err) => {
      console.error('🚨 Erreur HTTP:', err);
    }
  });
}


  loadDevises(): void {
    this.devisesService.getAll().subscribe(data => this.devisesList = data);
  }

  filterDevises(event: any): void {
    const query = event.query.toLowerCase();
    this.filteredDevises = this.devisesList.filter(dev =>
      dev.code?.toLowerCase().includes(query)
    );
  }

  openModal(): void {
    this.displayModal = true;
    this.isEdit = false;
    this.tauxForm.reset();
  }

  editTaux(taux: any): void {
  this.displayModal = true;
  this.isEdit = true;
  this.editedId = taux.id;

this.tauxForm.patchValue({
  date: taux.date?.split('T')[0],
  value: taux.value,
  variationAnnuelle: taux.variationAnnuelle,
  devises: typeof taux.devises === 'object'
    ? this.devisesList.find(d => d.id === taux.devises.id) || taux.devises
    : this.devisesList.find(d => d.id === taux.devises) || { id: taux.devises }
});

}


  confirmSave(): void {
    this.confirmationService.confirm({
      message: this.isEdit ? 'Confirmer la modification ?' : 'Confirmer l\'ajout ?',
      header: 'Confirmation',
      icon: 'pi pi-check',
      accept: () => this.saveTaux()
    });
  }

  saveTaux(): void {
    const raw = this.tauxForm.value;
    const data = {
      date: raw.date,
      value: raw.value,
      variationAnnuelle: raw.variationAnnuelle,
        devises: typeof raw.devises === 'object' ? raw.devises : { id: raw.devises }  // ✅ correctif ici
    };

    if (this.isEdit && this.editedId !== null) {
      const data = {
        id: this.editedId,
        date: raw.date,
        value: raw.value,
        variationAnnuelle: raw.variationAnnuelle,
        devises: raw.devises
      };
      this.tauxService.update(this.editedId, data).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Modifié', detail: 'Taux modifié avec succès' });
        this.displayModal = false;
        this.loadTaux();
      });
    } else {
      this.tauxService.add(data).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Ajouté', detail: 'Taux ajouté avec succès' });
        this.displayModal = false;
        this.loadTaux();
      });
    }
  }

  confirmDelete(id: number): void {
    this.confirmationService.confirm({
      message: 'Confirmer la suppression ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteTaux(id)
    });
  }

  deleteTaux(id: number): void {
    this.tauxService.delete(id).subscribe(
      () => {
        this.tauxList = this.tauxList.filter(c => c.id !== id);
        this.messageService.add({ severity: 'success', summary: 'Supprimé', detail: 'Taux supprimé avec succès' });
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
