import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
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

  // unified search filter
  searchTerm = '';
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
      groupe:        ['', Validators.required],
      rang:          [null, Validators.required],
      tauxCTB:       [null, Validators.required],
      valeurminCTB:  [null, Validators.required],
      valeurmaxCTB:  [null, Validators.required],
      tauxRUS:       [null, Validators.required],
      valeurminRUS:  [null, Validators.required],
      valeurmaxRUS:  [null, Validators.required]
    });
  }

   loadCommissions(): void {
    this.service.getAll().subscribe(data => {
      this.commissions = data.sort((a, b) => b.id - a.id);
    });
  }

  get filteredCommissions(): any[] {
    const term = this.searchTerm.toLowerCase();
    return this.commissions.filter(c => {
      return c.groupe.toLowerCase().includes(term) ||
             String(c.rang).includes(term)       ||
             String(c.tauxCTB).includes(term)    ||
             String(c.valeurminCTB).includes(term) ||
             String(c.valeurmaxCTB).includes(term) ||
             String(c.tauxRUS).includes(term)    ||
             String(c.valeurminRUS).includes(term) ||
             String(c.valeurmaxRUS).includes(term);
    });
  }

  // ─── CRUD & modal (unchanged) ─────────────────────────────────────────────
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
      (data as any).id = this.editedId;
      this.service.update(this.editedId, data).subscribe(() => {
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
    if (this.user.image)                   return `/assets/uploads-images/${this.user.image}`;
    if (this.user.attributes?.image?.[0])  return `/assets/uploads-images/${this.user.attributes.image[0]}`;
    if (this.user.attributes?.picture)     return `/assets/uploads-images/${this.user.attributes.picture}`;
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
    return `Commission Electronique-${ts}.pdf`;
  }
}
