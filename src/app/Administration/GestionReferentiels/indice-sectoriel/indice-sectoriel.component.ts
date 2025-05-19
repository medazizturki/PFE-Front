import {Component,OnInit,HostListener,ElementRef,ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IndiceSectorielService } from '../Services/indice-sectoriel.service';

@Component({
  selector: 'app-indice-sectoriel',
  templateUrl: './indice-sectoriel.component.html',
  styleUrls: ['./indice-sectoriel.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class IndiceSectorielComponent implements OnInit {
  indices: any[] = [];
  indiceForm!: FormGroup;
  isEdit = false;
  editedId: number | null = null;
  displayModal = false;
  user: any = JSON.parse(localStorage.getItem('user') || '{}');
  filteredGroupes: any[] = [];

  // unified search filter
  searchTerm = '';

  constructor(
    private fb: FormBuilder,
    private svc: IndiceSectorielService,
    private confirmation: ConfirmationService,
    private messageService: MessageService,
    private message: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadIndices();
  }

  private initForm(): void {
    this.indiceForm = this.fb.group({
      codeIsin:   ['', Validators.required],
      codeICB:    ['', Validators.required],
      groupe:     ['', Validators.required],
      mnemonique: ['', Validators.required],
      libellefr:  ['', Validators.required],
      libellear:  ['', Validators.required],
      libelleen:  ['', Validators.required],
      description:['', Validators.required]
    });
  }

  private loadIndices(): void {
    this.svc.getAll().subscribe(data => {
      this.indices = data.sort((a, b) => b.id - a.id);
    });
  }
get filteredIndices(): any[] {
    const term = this.searchTerm.toLowerCase();
    return this.indices.filter(i =>
      i.codeIsin.toLowerCase().includes(term) ||
      i.codeICB.toLowerCase().includes(term)   ||
      i.groupe.toLowerCase().includes(term)    ||
      i.mnemonique.toLowerCase().includes(term)||
      i.libellefr.toLowerCase().includes(term) ||
      i.libellear.toLowerCase().includes(term) ||
      i.libelleen.toLowerCase().includes(term) ||
      i.description.toLowerCase().includes(term)
    );
  }


  openModal(): void {
    this.displayModal = true;
    this.isEdit = false;
    this.indiceForm.reset();
  }

  editIndice(i: any): void {
    this.displayModal = true;
    this.isEdit = true;
    this.editedId = i.id;
    this.indiceForm.patchValue(i);
  }

  confirmSave(): void {
    this.confirmation.confirm({
      message: this.isEdit ? 'Confirmer la modification ?' : 'Confirmer l\'ajout ?',
      header:  'Confirmation',
      icon:    'pi pi-check',
      accept:  () => this.saveIndice()
    });
  }

  saveIndice(): void {
    const raw = this.indiceForm.value;
    if (this.isEdit && this.editedId != null) {
      raw.id = this.editedId;
      this.svc.update(this.editedId, raw).subscribe(() => this.afterSave());
    } else {
      this.svc.add(raw).subscribe(() => this.afterSave());
    }
  }

  private afterSave(): void {
    this.message.add({
      severity: this.isEdit ? 'success' : 'success',
      summary:  this.isEdit ? 'Modifié'  : 'Ajouté'
    });
    this.displayModal = false;
    this.loadIndices();
  }

  confirmDelete(id: number): void {
    this.confirmation.confirm({
      message: 'Confirmer la suppression ?',
      header:  'Confirmation',
      icon:    'pi pi-exclamation-triangle',
      accept:  () => this.deleteIndice(id)
    });
  }



  deleteIndice(id: number): void {
    this.svc.delete(id).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Supprimé', detail: 'Groupe supprimé avec succès' });
      this.loadIndices();
    }, err => {
      console.error('Erreur suppression:', err);
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Échec de la suppression' });
    });
  }

  logout(): void {
    localStorage.clear();
    window.location.href = '/login';
  }

  getUserImagePath(): string {
    const u = this.user;
    if (!u) return '';
    if (u.image)                   return `/assets/uploads-images/${u.image}`;
    if (u.attributes?.image?.[0])  return `/assets/uploads-images/${u.attributes.image[0]}`;
    if (u.attributes?.picture)     return `/assets/uploads-images/${u.attributes.picture}`;
    return '';
  }

  
  /** Appelé depuis le bouton Exporter en PDF */
  generatePDF(): void {
    this.svc.downloadPdf().subscribe(blob => {
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
    return `Indice Sectoriel-${ts}.pdf`;
  }
}
