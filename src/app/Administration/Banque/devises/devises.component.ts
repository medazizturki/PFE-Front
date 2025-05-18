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

  // ─── Filters ────────────────────────────────────────────────────────────────
  filterCode   = '';
  filterLibFr  = '';
  filterLibCfr = '';
  filterLibAr  = '';
  filterLibCar = '';
  filterLibEn  = '';
  filterLibCen = '';

  showFilterCode   = false;
  showFilterLibFr  = false;
  showFilterLibCfr = false;
  showFilterLibAr  = false;
  showFilterLibCar = false;
  showFilterLibEn  = false;
  showFilterLibCen = false;

  @ViewChild('codeToggler')    codeToggler!: ElementRef;
  @ViewChild('codeFilter')     codeFilter!: ElementRef;
  @ViewChild('libFrToggler')   libFrToggler!: ElementRef;
  @ViewChild('libFrFilter')    libFrFilter!: ElementRef;
  @ViewChild('libCfrToggler')  libCfrToggler!: ElementRef;
  @ViewChild('libCfrFilter')   libCfrFilter!: ElementRef;
  @ViewChild('libArToggler')   libArToggler!: ElementRef;
  @ViewChild('libArFilter')    libArFilter!: ElementRef;
  @ViewChild('libCarToggler')  libCarToggler!: ElementRef;
  @ViewChild('libCarFilter')   libCarFilter!: ElementRef;
  @ViewChild('libEnToggler')   libEnToggler!: ElementRef;
  @ViewChild('libEnFilter')    libEnFilter!: ElementRef;
  @ViewChild('libCenToggler')  libCenToggler!: ElementRef;
  @ViewChild('libCenFilter')   libCenFilter!: ElementRef;

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
      // newest first
      this.devisesList = data.sort((a, b) => b.id - a.id);
    });
  }

  // ─── Filtered & sorted getter ───────────────────────────────────────────────
  get filteredDevises(): any[] {
    return this.devisesList
      .filter(d =>
        d.code.toLowerCase().includes(this.filterCode.toLowerCase()) &&
        d.libellefr.toLowerCase().includes(this.filterLibFr.toLowerCase()) &&
        d.libelleCfr.toLowerCase().includes(this.filterLibCfr.toLowerCase()) &&
        d.libellear.toLowerCase().includes(this.filterLibAr.toLowerCase()) &&
        d.libelleCar.toLowerCase().includes(this.filterLibCar.toLowerCase()) &&
        d.libelleen.toLowerCase().includes(this.filterLibEn.toLowerCase()) &&
        d.libelleCen.toLowerCase().includes(this.filterLibCen.toLowerCase())
      );
  }

  // ─── Toggler ───────────────────────────────────────────────────────────────
  toggleFilter(col:
    'code' | 'libFr' | 'libCfr' | 'libAr' |
    'libCar' | 'libEn' | 'libCen'
  ): void {
    switch (col) {
      case 'code':
        this.showFilterCode = !this.showFilterCode;
        if (!this.showFilterCode) this.filterCode = '';
        break;
      case 'libFr':
        this.showFilterLibFr = !this.showFilterLibFr;
        if (!this.showFilterLibFr) this.filterLibFr = '';
        break;
      case 'libCfr':
        this.showFilterLibCfr = !this.showFilterLibCfr;
        if (!this.showFilterLibCfr) this.filterLibCfr = '';
        break;
      case 'libAr':
        this.showFilterLibAr = !this.showFilterLibAr;
        if (!this.showFilterLibAr) this.filterLibAr = '';
        break;
      case 'libCar':
        this.showFilterLibCar = !this.showFilterLibCar;
        if (!this.showFilterLibCar) this.filterLibCar = '';
        break;
      case 'libEn':
        this.showFilterLibEn = !this.showFilterLibEn;
        if (!this.showFilterLibEn) this.filterLibEn = '';
        break;
      case 'libCen':
        this.showFilterLibCen = !this.showFilterLibCen;
        if (!this.showFilterLibCen) this.filterLibCen = '';
        break;
    }
  }

  // ─── Close on outside click ───────────────────────────────────────────────
  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    if (this.showFilterCode &&
        !this.codeToggler.nativeElement.contains(target) &&
        !this.codeFilter.nativeElement.contains(target)) {
      this.showFilterCode = false;
    }
    if (this.showFilterLibFr &&
        !this.libFrToggler.nativeElement.contains(target) &&
        !this.libFrFilter.nativeElement.contains(target)) {
      this.showFilterLibFr = false;
    }
    if (this.showFilterLibCfr &&
        !this.libCfrToggler.nativeElement.contains(target) &&
        !this.libCfrFilter.nativeElement.contains(target)) {
      this.showFilterLibCfr = false;
    }
    if (this.showFilterLibAr &&
        !this.libArToggler.nativeElement.contains(target) &&
        !this.libArFilter.nativeElement.contains(target)) {
      this.showFilterLibAr = false;
    }
    if (this.showFilterLibCar &&
        !this.libCarToggler.nativeElement.contains(target) &&
        !this.libCarFilter.nativeElement.contains(target)) {
      this.showFilterLibCar = false;
    }
    if (this.showFilterLibEn &&
        !this.libEnToggler.nativeElement.contains(target) &&
        !this.libEnFilter.nativeElement.contains(target)) {
      this.showFilterLibEn = false;
    }
    if (this.showFilterLibCen &&
        !this.libCenToggler.nativeElement.contains(target) &&
        !this.libCenFilter.nativeElement.contains(target)) {
      this.showFilterLibCen = false;
    }
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
