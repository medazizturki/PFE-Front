// src/app/categorieavoir/categorieavoir.component.ts
import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CategorieavoirService } from '../Services/categorieavoir.service';

@Component({
  selector: 'app-categorieavoir',
  templateUrl: './categorieavoir.component.html',
  styleUrls: ['./categorieavoir.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class CategorieavoirComponent implements OnInit {
  categories: any[] = [];
  categorieForm!: FormGroup;
  isEdit = false;
  editedId: number | null = null;
  displayModal = false;
  user: any = JSON.parse(localStorage.getItem('user') || '{}');

  // ─── Filters ────────────────────────────────────────────────────────────────
  filterCodeBVMT           = '';
  filterCodeNSC            = '';
  filterCodeOptique        = '';
  filterCodeTc             = '';
  filterLibFr              = '';
  filterLibCFr             = '';
  filterLibAr              = '';
  filterLibCAr             = '';
  filterLibEn              = '';
  filterLibCEn             = '';
  filterTauxCTB            = '';
  filterTauxRUS            = '';
  filterTauxCEB_ENR        = '';
  filterTauxRUS_ENR        = '';

  showFilterCodeBVMT        = false;
  showFilterCodeNSC         = false;
  showFilterCodeOptique     = false;
  showFilterCodeTc          = false;
  showFilterLibFr           = false;
  showFilterLibCFr          = false;
  showFilterLibAr           = false;
  showFilterLibCAr          = false;
  showFilterLibEn           = false;
  showFilterLibCEn          = false;
  showFilterTauxCTB         = false;
  showFilterTauxRUS         = false;
  showFilterTauxCEB_ENR     = false;
  showFilterTauxRUS_ENR     = false;

  @ViewChild('codeBVMTToggler')       codeBVMTToggler!: ElementRef;
  @ViewChild('codeBVMTFilter')        codeBVMTFilter!: ElementRef;
  @ViewChild('codeNSCToggler')        codeNSCToggler!: ElementRef;
  @ViewChild('codeNSCFilter')         codeNSCFilter!: ElementRef;
  @ViewChild('codeOptiqueToggler')    codeOptiqueToggler!: ElementRef;
  @ViewChild('codeOptiqueFilter')     codeOptiqueFilter!: ElementRef;
  @ViewChild('codeTcToggler')         codeTcToggler!: ElementRef;
  @ViewChild('codeTcFilter')          codeTcFilter!: ElementRef;
  @ViewChild('libFrToggler')          libFrToggler!: ElementRef;
  @ViewChild('libFrFilter')           libFrFilter!: ElementRef;
  @ViewChild('libCFrToggler')         libCFrToggler!: ElementRef;
  @ViewChild('libCFrFilter')          libCFrFilter!: ElementRef;
  @ViewChild('libArToggler')          libArToggler!: ElementRef;
  @ViewChild('libArFilter')           libArFilter!: ElementRef;
  @ViewChild('libCArToggler')         libCArToggler!: ElementRef;
  @ViewChild('libCArFilter')          libCArFilter!: ElementRef;
  @ViewChild('libEnToggler')          libEnToggler!: ElementRef;
  @ViewChild('libEnFilter')           libEnFilter!: ElementRef;
  @ViewChild('libCEnToggler')         libCEnToggler!: ElementRef;
  @ViewChild('libCEnFilter')          libCEnFilter!: ElementRef;
  @ViewChild('tauxCTBToggler')        tauxCTBToggler!: ElementRef;
  @ViewChild('tauxCTBFilter')         tauxCTBFilter!: ElementRef;
  @ViewChild('tauxRUSToggler')        tauxRUSToggler!: ElementRef;
  @ViewChild('tauxRUSFilter')         tauxRUSFilter!: ElementRef;
  @ViewChild('tauxCEB_ENRToggler')    tauxCEB_ENRToggler!: ElementRef;
  @ViewChild('tauxCEB_ENRFilter')     tauxCEB_ENRFilter!: ElementRef;
  @ViewChild('tauxRUS_ENRToggler')    tauxRUS_ENRToggler!: ElementRef;
  @ViewChild('tauxRUS_ENRFilter')     tauxRUS_ENRFilter!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private service: CategorieavoirService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCategories();
    this.getUserImagePath();
  }

  initForm(): void {
    this.categorieForm = this.fb.group({
      codeBVMT:           ['', Validators.required],
      codeNSC:            ['', Validators.required],
      codeOptique:        ['', Validators.required],
      codeTc:             ['', Validators.required],
      libellefr:          ['', Validators.required],
      libellecourtefr:    ['', Validators.required],
      libellear:          ['', Validators.required],
      libellecourtear:    ['', Validators.required],
      libelleen:          ['', Validators.required],
      libellecourteen:    ['', Validators.required],
      tauxreductionCTB:   [null, Validators.required],
      tauxreductionRUS:   [null, Validators.required],
      tauxreductionCEB_ENR: [null, Validators.required],
      tauxreductionRUS_ENR: [null, Validators.required]
    });
  }

  loadCategories(): void {
  this.service.getAll().subscribe(data => {
    this.categories = data.sort((a, b) => b.id - a.id); // Sort newest first
  });
}

  // ─── Filtered getter ───────────────────────────────────────────────────────
  get filteredCategories(): any[] {
    return this.categories.filter(c => {
      return c.codeBVMT          .toLowerCase().includes(this.filterCodeBVMT.toLowerCase())    &&
             c.codeNSC           .toLowerCase().includes(this.filterCodeNSC.toLowerCase())     &&
             c.codeOptique       .toLowerCase().includes(this.filterCodeOptique.toLowerCase()) &&
             c.codeTc            .toLowerCase().includes(this.filterCodeTc.toLowerCase())      &&
             c.libellefr         .toLowerCase().includes(this.filterLibFr.toLowerCase())       &&
             c.libellecourtefr   .toLowerCase().includes(this.filterLibCFr.toLowerCase())      &&
             c.libellear         .toLowerCase().includes(this.filterLibAr.toLowerCase())       &&
             c.libellecourtear   .toLowerCase().includes(this.filterLibCAr.toLowerCase())      &&
             c.libelleen         .toLowerCase().includes(this.filterLibEn.toLowerCase())       &&
             c.libellecourteen   .toLowerCase().includes(this.filterLibCEn.toLowerCase())      &&
             String(c.tauxreductionCTB).includes(this.filterTauxCTB)                         &&
             String(c.tauxreductionRUS).includes(this.filterTauxRUS)                         &&
             String(c.tauxreductionCEB_ENR).includes(this.filterTauxCEB_ENR)                 &&
             String(c.tauxreductionRUS_ENR).includes(this.filterTauxRUS_ENR);
    });
  }

  // ─── Toggle filters ────────────────────────────────────────────────────────
  toggleFilter(col:
    'codeBVMT'|'codeNSC'|'codeOptique'|'codeTc'|
    'libFr'|'libCFr'|'libAr'|'libCAr'|
    'libEn'|'libCEn'|'tauxCTB'|'tauxRUS'|
    'tauxCEB_ENR'|'tauxRUS_ENR'
  ): void {
    switch (col) {
      case 'codeBVMT':
        this.showFilterCodeBVMT = !this.showFilterCodeBVMT;
        if (!this.showFilterCodeBVMT) this.filterCodeBVMT = '';
        break;
      case 'codeNSC':
        this.showFilterCodeNSC = !this.showFilterCodeNSC;
        if (!this.showFilterCodeNSC) this.filterCodeNSC = '';
        break;
      case 'codeOptique':
        this.showFilterCodeOptique = !this.showFilterCodeOptique;
        if (!this.showFilterCodeOptique) this.filterCodeOptique = '';
        break;
      case 'codeTc':
        this.showFilterCodeTc = !this.showFilterCodeTc;
        if (!this.showFilterCodeTc) this.filterCodeTc = '';
        break;
      case 'libFr':
        this.showFilterLibFr = !this.showFilterLibFr;
        if (!this.showFilterLibFr) this.filterLibFr = '';
        break;
      case 'libCFr':
        this.showFilterLibCFr = !this.showFilterLibCFr;
        if (!this.showFilterLibCFr) this.filterLibCFr = '';
        break;
      case 'libAr':
        this.showFilterLibAr = !this.showFilterLibAr;
        if (!this.showFilterLibAr) this.filterLibAr = '';
        break;
      case 'libCAr':
        this.showFilterLibCAr = !this.showFilterLibCAr;
        if (!this.showFilterLibCAr) this.filterLibCAr = '';
        break;
      case 'libEn':
        this.showFilterLibEn = !this.showFilterLibEn;
        if (!this.showFilterLibEn) this.filterLibEn = '';
        break;
      case 'libCEn':
        this.showFilterLibCEn = !this.showFilterLibCEn;
        if (!this.showFilterLibCEn) this.filterLibCEn = '';
        break;
      case 'tauxCTB':
        this.showFilterTauxCTB = !this.showFilterTauxCTB;
        if (!this.showFilterTauxCTB) this.filterTauxCTB = '';
        break;
      case 'tauxRUS':
        this.showFilterTauxRUS = !this.showFilterTauxRUS;
        if (!this.showFilterTauxRUS) this.filterTauxRUS = '';
        break;
      case 'tauxCEB_ENR':
        this.showFilterTauxCEB_ENR = !this.showFilterTauxCEB_ENR;
        if (!this.showFilterTauxCEB_ENR) this.filterTauxCEB_ENR = '';
        break;
      case 'tauxRUS_ENR':
        this.showFilterTauxRUS_ENR = !this.showFilterTauxRUS_ENR;
        if (!this.showFilterTauxRUS_ENR) this.filterTauxRUS_ENR = '';
        break;
    }
  }

  // ─── Close on outside click ────────────────────────────────────────────────
  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    if (this.showFilterCodeBVMT &&
        !this.codeBVMTToggler.nativeElement.contains(target) &&
        !this.codeBVMTFilter.nativeElement.contains(target)) {
      this.showFilterCodeBVMT = false;
    }
    if (this.showFilterCodeNSC &&
        !this.codeNSCToggler.nativeElement.contains(target) &&
        !this.codeNSCFilter.nativeElement.contains(target)) {
      this.showFilterCodeNSC = false;
    }
    if (this.showFilterCodeOptique &&
        !this.codeOptiqueToggler.nativeElement.contains(target) &&
        !this.codeOptiqueFilter.nativeElement.contains(target)) {
      this.showFilterCodeOptique = false;
    }
    if (this.showFilterCodeTc &&
        !this.codeTcToggler.nativeElement.contains(target) &&
        !this.codeTcFilter.nativeElement.contains(target)) {
      this.showFilterCodeTc = false;
    }
    if (this.showFilterLibFr &&
        !this.libFrToggler.nativeElement.contains(target) &&
        !this.libFrFilter.nativeElement.contains(target)) {
      this.showFilterLibFr = false;
    }
    if (this.showFilterLibCFr &&
        !this.libCFrToggler.nativeElement.contains(target) &&
        !this.libCFrFilter.nativeElement.contains(target)) {
      this.showFilterLibCFr = false;
    }
    if (this.showFilterLibAr &&
        !this.libArToggler.nativeElement.contains(target) &&
        !this.libArFilter.nativeElement.contains(target)) {
      this.showFilterLibAr = false;
    }
    if (this.showFilterLibCAr &&
        !this.libCArToggler.nativeElement.contains(target) &&
        !this.libCArFilter.nativeElement.contains(target)) {
      this.showFilterLibCAr = false;
    }
    if (this.showFilterLibEn &&
        !this.libEnToggler.nativeElement.contains(target) &&
        !this.libEnFilter.nativeElement.contains(target)) {
      this.showFilterLibEn = false;
    }
    if (this.showFilterLibCEn &&
        !this.libCEnToggler.nativeElement.contains(target) &&
        !this.libCEnFilter.nativeElement.contains(target)) {
      this.showFilterLibCEn = false;
    }
    if (this.showFilterTauxCTB &&
        !this.tauxCTBToggler.nativeElement.contains(target) &&
        !this.tauxCTBFilter.nativeElement.contains(target)) {
      this.showFilterTauxCTB = false;
    }
    if (this.showFilterTauxRUS &&
        !this.tauxRUSToggler.nativeElement.contains(target) &&
        !this.tauxRUSFilter.nativeElement.contains(target)) {
      this.showFilterTauxRUS = false;
    }
    if (this.showFilterTauxCEB_ENR &&
        !this.tauxCEB_ENRToggler.nativeElement.contains(target) &&
        !this.tauxCEB_ENRFilter.nativeElement.contains(target)) {
      this.showFilterTauxCEB_ENR = false;
    }
    if (this.showFilterTauxRUS_ENR &&
        !this.tauxRUS_ENRToggler.nativeElement.contains(target) &&
        !this.tauxRUS_ENRFilter.nativeElement.contains(target)) {
      this.showFilterTauxRUS_ENR = false;
    }
  }

  // ─── CRUD & modal (unchanged) ─────────────────────────────────────────────
  openSignupModal(): void {
    this.displayModal = true;
    this.isEdit = false;
    this.categorieForm.reset();
  }
  editCategorie(cat: any): void {
    this.displayModal = true;
    this.isEdit = true;
    this.editedId = cat.id;
    this.categorieForm.patchValue(cat);
  }
  confirmSave(): void {
    if (this.categorieForm.invalid) return;
    this.confirmationService.confirm({
      message: this.isEdit ? 'Confirmer la modification ?' : 'Confirmer l\'ajout ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.saveCategorie()
    });
  }
  saveCategorie(): void {
    const data = this.categorieForm.value;
    if (this.isEdit && this.editedId !== null) {
      this.service.update(this.editedId, { ...data, id: this.editedId })
          .subscribe(() => {
        this.messageService.add({ severity:'success', summary:'Succès', detail:'Catégorie modifiée' });
        this.displayModal = false; this.loadCategories();
      });
    } else {
      this.service.add(data).subscribe(() => {
        this.messageService.add({ severity:'success', summary:'Ajouté', detail:'Catégorie ajoutée' });
        this.displayModal = false; this.loadCategories();
      });
    }
  }
  confirmDelete(id: number): void {
    this.confirmationService.confirm({
      message: 'Confirmer la suppression ?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteCategorie(id)
    });
  }
  deleteCategorie(id: number): void {
    this.service.delete(id).subscribe(() => {
      this.categories = this.categories.filter(c => c.id !== id);
      this.messageService.add({ severity:'success', summary:'Supprimé', detail:'Catégorie supprimée' });
    });
  }
  logout(): void {
    localStorage.clear(); window.location.href = '/login';
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
    return `Catégorie d'Avoir-${ts}.pdf`;
  }
}
