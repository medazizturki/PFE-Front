import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
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
  displayModal = false;
  user: any = JSON.parse(localStorage.getItem('user') || '{}');

  // unified search filter
  searchTerm = '';

 
  constructor(
    private fb: FormBuilder,
    private tmmService: TMMService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchTMMs();
  }

  initForm(): void {
    this.tmmForm = this.fb.group({
      mois: ['', Validators.required],
      tmm:  [null, Validators.required]
    });
  }

  fetchTMMs(): void {
    this.tmmService.getAllTMM().subscribe(data => {
      this.tmmList = data.sort((a, b) => b.id - a.id);
    });
  }

  get filteredTMMs(): any[] {
    const term = this.searchTerm.toLowerCase();
    return this.tmmList
      .filter(item => {
        const moisText = item.mois?.split('T')[0].toLowerCase() || '';
        return moisText.includes(term) ||
               String(item.tmm).toLowerCase().includes(term);
      });
  }

  openSignupModal(): void {
    this.displayModal = true;
    this.isEdit = false;
    this.tmmForm.reset();
  }

  editTMM(tmm: any): void {
    this.displayModal = true;
    this.isEdit = true;
    this.editedId = tmm.id;
    const formattedDate = tmm.mois?.split('T')[0] || '';
    this.tmmForm.patchValue({ mois: formattedDate, tmm: tmm.tmm });
  }

  confirmSaveTMM(): void {
    if (this.tmmForm.invalid) return;
    this.confirmationService.confirm({
      message: this.isEdit
        ? 'Confirmer la modification ?'
        : 'Confirmer l’ajout ?',
      header: 'Confirmation',
      icon: 'pi pi-check',
      accept: () => this.saveTMM()
    });
  }

  saveTMM(): void {
    const data = this.tmmForm.value;
    if (this.isEdit && this.editedId !== null) {
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
      reject: () => this.fetchTMMs()
    });
  }

  deleteTMM(id: number): void {
    this.tmmService.deleteTMM(id).subscribe(
      () => {
        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'TMM supprimé avec succès' });
        this.fetchTMMs();
      },
      err => {
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
    if (this.user.image)                  return `/assets/uploads-images/${this.user.image}`;
    if (this.user.attributes?.image?.[0]) return `/assets/uploads-images/${this.user.attributes.image[0]}`;
    if (this.user.attributes?.picture)    return `/assets/uploads-images/${this.user.attributes.picture}`;
    return '';
  }

  
  /** Appelé depuis le bouton Exporter en PDF */
  generatePDF(): void {
    this.tmmService.downloadPdf().subscribe(blob => {
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
    return `TMM-${ts}.pdf`;
  }
}
