import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IntermediaireService } from '../Services/intermediaire.service';

@Component({
  selector: 'app-intermediaire',
  templateUrl: './intermediaire.component.html',
  styleUrls: ['./intermediaire.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class IntermediaireComponent implements OnInit {
  intermediaires: any[] = [];
  interForm!: FormGroup;
  isEdit = false;
  editedId: number | null = null;
  displayModal = false;
  user: any = JSON.parse(localStorage.getItem('user') || '{}');

  // unified search filter
  searchTerm = '';
  constructor(
    private fb: FormBuilder,
    private svc: IntermediaireService,
    private confirmation: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadIntermediaires();
  }

initForm(): void {
  this.interForm = this.fb.group({
    code:               ['', Validators.required],
    libellefr:          ['', Validators.required],
    symbolefrancais:    ['', Validators.required],
    libellear:          ['', Validators.required],
    symbolearabe:       ['', Validators.required],
    libelleen:          ['', Validators.required],
    symboleanglais:     ['', Validators.required],
    adresse:            ['', Validators.required],
     fax: [
    '',
    [
      Validators.required,
      Validators.pattern(/^\d{8}$/)
    ]
  ],
    telephone:          [
                         '', 
                         [
                           Validators.required,
                           Validators.pattern(/^\d{8}$/)   // exactly 8 digits
                         ]
                       ],
    ceo:                ['', Validators.required],
    comptebanquaire:    ['', Validators.required],
    banque:             ['', Validators.required],
    typebanque:         ['', Validators.required]
  });
}


  loadIntermediaires(): void {
    this.svc.getAll().subscribe(data => {
      this.intermediaires = data.sort((a, b) => b.id - a.id);
    });
  }


    get filteredIntermediaires(): any[] {
    const term = this.searchTerm.toLowerCase();
    return this.intermediaires.filter(i =>
      (i.code || '').toLowerCase().includes(term) ||
      (i.libellefr || '').toLowerCase().includes(term) ||
      (i.symbolefrancais || '').toLowerCase().includes(term) ||
      (i.libellear || '').toLowerCase().includes(term) ||
      (i.symbolearabe || '').toLowerCase().includes(term) ||
      (i.libelleen || '').toLowerCase().includes(term) ||
      (i.symboleanglais || '').toLowerCase().includes(term) ||
      (i.adresse || '').toLowerCase().includes(term) ||
      (i.fax || '').toLowerCase().includes(term) ||
      (i.telephone || '').toLowerCase().includes(term) ||
      (i.ceo || '').toLowerCase().includes(term) ||
      (i.comptebanquaire || '').toLowerCase().includes(term) ||
      (i.banque || '').toLowerCase().includes(term) ||
      (i.typebanque || '').toLowerCase().includes(term)
    );
  }

  openModal(): void {
    this.displayModal = true;
    this.isEdit = false;
    this.interForm.reset();
  }

  editIntermediaire(i: any): void {
    this.displayModal = true;
    this.isEdit = true;
    this.editedId = i.id;
    this.interForm.patchValue(i);
  }

  confirmSave(): void {
    this.confirmation.confirm({
      message: this.isEdit ? 'Confirmer la modification ?' : 'Confirmer l\'ajout ?',
      header: 'Confirmation',
      icon: 'pi pi-check',
      accept: () => this.saveIntermediaire()
    });
  }

saveIntermediaire(): void {
  const raw = this.interForm.value;

  if (!this.isEdit) {
    // On create: set dateDebut = today, dateFin = today + 99 years
    const now = new Date();
    raw.dateDebut = now;
    raw.dateFin   = new Date(now.getFullYear() + 99,
                             now.getMonth(),
                             now.getDate());
  } else {
    // On edit: preserve existing dates (they’re already in the formGroup if you patched them)
    raw.id = this.editedId!;
  }

  if (this.isEdit) {
    this.svc.update(this.editedId!, raw).subscribe(() => this.afterSave());
  } else {
    this.svc.add(raw).subscribe(() => this.afterSave());
  }
}

  afterSave(): void {
    this.messageService.add({ severity: 'success', summary: this.isEdit ? 'Intermédiaire Modifié avec succès' : 'Intermédiaire Ajouté avec succès' });
    this.displayModal = false;
    this.loadIntermediaires();
  }

  confirmDelete(id: number): void {
    this.confirmation.confirm({
      message: 'Confirmer la suppression ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteIntermediaire(id)
    });
  }

  deleteIntermediaire(id: number): void {
    this.svc.delete(id).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Supprimé' });
      this.loadIntermediaires();
    }, err => {
      this.messageService.add({ severity: 'error', summary: 'Erreur' });
    });
  }



  logout(): void {
    localStorage.clear();
    window.location.href = '/login';
  }

  getUserImagePath(): string {
    const u = this.user;
    if (!u) return '';
    if (u.image) return `/assets/uploads-images/${u.image}`;
    if (u.attributes?.image?.[0]) return `/assets/uploads-images/${u.attributes.image[0]}`;
    if (u.attributes?.picture) return `/assets/uploads-images/${u.attributes.picture}`;
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
    return `Intermediaire-${ts}.pdf`;
  }
}