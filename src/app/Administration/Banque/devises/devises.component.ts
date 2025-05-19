import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
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
  displayModal = false;
  user: any = JSON.parse(localStorage.getItem('user') || '{}');

  // unified search term
  searchTerm = '';
  
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
      code:       ['', Validators.required],
      libellefr:  ['', Validators.required],
      libelleCfr: [''],
      libellear:  [''],
      libelleCar: [''],
      libelleen:  [''],
      libelleCen: ['']
    });
  }

  loadDevises(): void {
    this.service.getAll().subscribe(data => {
      this.devisesList = data.sort((a, b) => b.id - a.id);
    });
  }

  get filteredDevises(): any[] {
    const term = this.searchTerm.toLowerCase();
    return this.devisesList
      .filter(d =>
        d.code.toLowerCase().includes(term) ||
        d.libellefr.toLowerCase().includes(term) ||
        d.libelleCfr.toLowerCase().includes(term) ||
        d.libellear.toLowerCase().includes(term) ||
        d.libelleCar.toLowerCase().includes(term) ||
        d.libelleen.toLowerCase().includes(term) ||
        d.libelleCen.toLowerCase().includes(term)
      );
  }

  // ─── Modal / CRUD ────────────────────────────────────────────────────────
  openSignupModal() {
    this.displayModal = true;
    this.isEdit = false;
    this.devisesForm.reset();
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
      (data as any).id = this.editedId;
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
      reject: () => this.messageService.add({ severity: 'info', summary: 'Annulé', detail: 'Suppression annulée' })
    });
  }

  deleteDevises(id: number): void {
    this.service.delete(id).subscribe(
      () => {
        this.devisesList = this.devisesList.filter(d => d.id !== id);
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Devise supprimée avec succès' });
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
    return `Devises-${ts}.pdf`;
  }
}
