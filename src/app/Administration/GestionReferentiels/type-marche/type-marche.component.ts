import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TypemarcheService } from '../Services/typemarche.service';

@Component({
  selector: 'app-type-marche',
  templateUrl: './type-marche.component.html',
  styleUrls: ['./type-marche.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class TypeMarcheComponent implements OnInit {
  typeMarches: any[] = [];
  marcheForm!: FormGroup;
  isEdit = false;
  editedId: number | null = null;
  displayModal = false;
  user: any = JSON.parse(localStorage.getItem('user') || '{}');

  // ─── Filters ──────────────────────────────────────────────────────────────
  filterCodeBVMT = '';
  filterSuperType = '';
  filterLibFr    = '';
  filterLibAr    = '';
  filterLibEn    = '';

  showFilterCodeBVMT = false;
  showFilterSuperType = false;
  showFilterLibFr = false;
  showFilterLibAr = false;
  showFilterLibEn = false;

  @ViewChild('codeToggler')      codeToggler!: ElementRef;
  @ViewChild('codeFilter')       codeFilter!: ElementRef;
  @ViewChild('superTypeToggler') superTypeToggler!: ElementRef;
  @ViewChild('superTypeFilter')  superTypeFilter!: ElementRef;
  @ViewChild('libFrToggler')     libFrToggler!: ElementRef;
  @ViewChild('libFrFilter')      libFrFilter!: ElementRef;
  @ViewChild('libArToggler')     libArToggler!: ElementRef;
  @ViewChild('libArFilter')      libArFilter!: ElementRef;
  @ViewChild('libEnToggler')     libEnToggler!: ElementRef;
  @ViewChild('libEnFilter')      libEnFilter!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private service: TypemarcheService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTypes();
  }

  initForm(): void {
    this.marcheForm = this.fb.group({
      codeBVMT: ['', Validators.required],
      superType: ['', Validators.required],
      libellefr: ['', Validators.required],
      libellear: ['', Validators.required],
      libelleen: ['', Validators.required]
    });
  }

  loadTypes(): void {
    this.service.getAll().subscribe(data => {
      // newest first
      this.typeMarches = data.sort((a, b) => b.id - a.id);
    });
  }

  // ─── Filtered & sorted getter ───────────────────────────────────────────────
  get filteredTypeMarches(): any[] {
    return this.typeMarches.filter(t => {
      return t.codeBVMT.toLowerCase().includes(this.filterCodeBVMT.toLowerCase())
          && t.superType.toLowerCase().includes(this.filterSuperType.toLowerCase())
          && t.libellefr.toLowerCase().includes(this.filterLibFr.toLowerCase())
          && t.libellear.toLowerCase().includes(this.filterLibAr.toLowerCase())
          && t.libelleen.toLowerCase().includes(this.filterLibEn.toLowerCase());
    });
  }

  // ─── Toggle filters ───────────────────────────────────────────────────────
  toggleFilter(col: 'codeBVMT'|'superType'|'libFr'|'libAr'|'libEn'): void {
    switch (col) {
      case 'codeBVMT':
        this.showFilterCodeBVMT = !this.showFilterCodeBVMT;
        if (!this.showFilterCodeBVMT) this.filterCodeBVMT = '';
        break;
      case 'superType':
        this.showFilterSuperType = !this.showFilterSuperType;
        if (!this.showFilterSuperType) this.filterSuperType = '';
        break;
      case 'libFr':
        this.showFilterLibFr = !this.showFilterLibFr;
        if (!this.showFilterLibFr) this.filterLibFr = '';
        break;
      case 'libAr':
        this.showFilterLibAr = !this.showFilterLibAr;
        if (!this.showFilterLibAr) this.filterLibAr = '';
        break;
      case 'libEn':
        this.showFilterLibEn = !this.showFilterLibEn;
        if (!this.showFilterLibEn) this.filterLibEn = '';
        break;
    }
  }

  // ─── Close on outside click ───────────────────────────────────────────────
  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    if (this.showFilterCodeBVMT &&
        !this.codeToggler.nativeElement.contains(target) &&
        !this.codeFilter.nativeElement.contains(target)) {
      this.showFilterCodeBVMT = false;
    }
    if (this.showFilterSuperType &&
        !this.superTypeToggler.nativeElement.contains(target) &&
        !this.superTypeFilter.nativeElement.contains(target)) {
      this.showFilterSuperType = false;
    }
    if (this.showFilterLibFr &&
        !this.libFrToggler.nativeElement.contains(target) &&
        !this.libFrFilter.nativeElement.contains(target)) {
      this.showFilterLibFr = false;
    }
    if (this.showFilterLibAr &&
        !this.libArToggler.nativeElement.contains(target) &&
        !this.libArFilter.nativeElement.contains(target)) {
      this.showFilterLibAr = false;
    }
    if (this.showFilterLibEn &&
        !this.libEnToggler.nativeElement.contains(target) &&
        !this.libEnFilter.nativeElement.contains(target)) {
      this.showFilterLibEn = false;
    }
  }

  // ─── CRUD modal ────────────────────────────────────────────────────────────
  openSignupModal() {
    this.displayModal = true;
    this.isEdit = false;
    this.marcheForm.reset();
  }

  editType(type: any): void {
    this.displayModal = true;
    this.isEdit = true;
    this.editedId = type.id;
    this.marcheForm.patchValue(type);
  }

  confirmSaveType(): void {
    if (this.marcheForm.invalid) return;
    this.confirmationService.confirm({
      message: this.isEdit ? 'Confirmer la modification ?' : 'Confirmer l’ajout ?',
      header: 'Confirmation',
      icon: 'pi pi-check',
      accept: () => this.saveType()
    });
  }

  saveType(): void {
    const data = this.marcheForm.value;
    if (this.isEdit && this.editedId != null) {
      (data as any).id = this.editedId;
      this.service.update(this.editedId, data).subscribe(() => {
        this.messageService.add({ severity:'success', summary:'Succès', detail:'Type modifié avec succès' });
        this.displayModal = false;
        this.loadTypes();
      });
    } else {
      this.service.add(data).subscribe(() => {
        this.messageService.add({ severity:'success', summary:'Ajouté', detail:'Type ajouté avec succès' });
        this.displayModal = false;
        this.loadTypes();
      });
    }
  }

  confirmDelete(id: number): void {
    this.confirmationService.confirm({
      message: 'Êtes-vous sûr de vouloir supprimer ce Type de Marché ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteType(id),
      reject: () => this.messageService.add({ severity:'info', summary:'Annulé', detail:'Suppression annulée' })
    });
  }

  deleteType(id: number): void {
    this.service.delete(id).subscribe(
      () => {
        this.typeMarches = this.typeMarches.filter(t => t.id !== id);
        this.messageService.add({ severity:'success', summary:'Succès', detail:'Type supprimé avec succès' });
      },
      err => {
        console.error('Erreur:', err);
        this.messageService.add({ severity:'error', summary:'Erreur', detail:'Échec de la suppression' });
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
    return `Type Marché-${ts}.pdf`;
  }
}
