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

  // ─── Filters ────────────────────────────────────────────────────────────────
  filterGroupe   = '';
  filterRang     = '';
  filterTauxCTB  = '';
  filterMinCTB   = '';
  filterMaxCTB   = '';
  filterTauxRUS  = '';
  filterMinRUS   = '';
  filterMaxRUS   = '';

  showFilterGroupe  = false;
  showFilterRang    = false;
  showFilterTauxCTB = false;
  showFilterMinCTB  = false;
  showFilterMaxCTB  = false;
  showFilterTauxRUS = false;
  showFilterMinRUS  = false;
  showFilterMaxRUS  = false;

  @ViewChild('groupeToggler')   groupeToggler!: ElementRef;
  @ViewChild('groupeFilter')    groupeFilter!: ElementRef;
  @ViewChild('rangToggler')     rangToggler!: ElementRef;
  @ViewChild('rangFilter')      rangFilter!: ElementRef;
  @ViewChild('tauxCTBToggler')  tauxCTBToggler!: ElementRef;
  @ViewChild('tauxCTBFilter')   tauxCTBFilter!: ElementRef;
  @ViewChild('minCTBToggler')   minCTBToggler!: ElementRef;
  @ViewChild('minCTBFilter')    minCTBFilter!: ElementRef;
  @ViewChild('maxCTBToggler')   maxCTBToggler!: ElementRef;
  @ViewChild('maxCTBFilter')    maxCTBFilter!: ElementRef;
  @ViewChild('tauxRUSToggler')  tauxRUSToggler!: ElementRef;
  @ViewChild('tauxRUSFilter')   tauxRUSFilter!: ElementRef;
  @ViewChild('minRUSToggler')   minRUSToggler!: ElementRef;
  @ViewChild('minRUSFilter')    minRUSFilter!: ElementRef;
  @ViewChild('maxRUSToggler')   maxRUSToggler!: ElementRef;
  @ViewChild('maxRUSFilter')    maxRUSFilter!: ElementRef;

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

  // ─── Filtered getter ───────────────────────────────────────────────────────
  get filteredCommissions(): any[] {
    return this.commissions.filter(c => {
      const okG = !this.filterGroupe  || c.groupe.toLowerCase().includes(this.filterGroupe.toLowerCase());
      const okR = !this.filterRang    || String(c.rang).includes(this.filterRang);
      const okC = !this.filterTauxCTB || String(c.tauxCTB).includes(this.filterTauxCTB);
      const okm = !this.filterMinCTB  || String(c.valeurminCTB).includes(this.filterMinCTB);
      const okM = !this.filterMaxCTB  || String(c.valeurmaxCTB).includes(this.filterMaxCTB);
      const okT = !this.filterTauxRUS || String(c.tauxRUS).includes(this.filterTauxRUS);
      const okn = !this.filterMinRUS  || String(c.valeurminRUS).includes(this.filterMinRUS);
      const okX = !this.filterMaxRUS  || String(c.valeurmaxRUS).includes(this.filterMaxRUS);
      return okG && okR && okC && okm && okM && okT && okn && okX;
    });
  }

  // ─── Toggle Filters ────────────────────────────────────────────────────────
  toggleFilter(col:
    'groupe'|'rang'|'tauxCTB'|'minCTB'|'maxCTB'|
    'tauxRUS'|'minRUS'|'maxRUS'
  ): void {
    switch (col) {
      case 'groupe':
        this.showFilterGroupe = !this.showFilterGroupe;
        if (!this.showFilterGroupe) this.filterGroupe = '';
        break;
      case 'rang':
        this.showFilterRang = !this.showFilterRang;
        if (!this.showFilterRang) this.filterRang = '';
        break;
      case 'tauxCTB':
        this.showFilterTauxCTB = !this.showFilterTauxCTB;
        if (!this.showFilterTauxCTB) this.filterTauxCTB = '';
        break;
      case 'minCTB':
        this.showFilterMinCTB = !this.showFilterMinCTB;
        if (!this.showFilterMinCTB) this.filterMinCTB = '';
        break;
      case 'maxCTB':
        this.showFilterMaxCTB = !this.showFilterMaxCTB;
        if (!this.showFilterMaxCTB) this.filterMaxCTB = '';
        break;
      case 'tauxRUS':
        this.showFilterTauxRUS = !this.showFilterTauxRUS;
        if (!this.showFilterTauxRUS) this.filterTauxRUS = '';
        break;
      case 'minRUS':
        this.showFilterMinRUS = !this.showFilterMinRUS;
        if (!this.showFilterMinRUS) this.filterMinRUS = '';
        break;
      case 'maxRUS':
        this.showFilterMaxRUS = !this.showFilterMaxRUS;
        if (!this.showFilterMaxRUS) this.filterMaxRUS = '';
        break;
    }
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    if (this.showFilterGroupe &&
        !this.groupeToggler.nativeElement.contains(target) &&
        !this.groupeFilter.nativeElement.contains(target)) {
      this.showFilterGroupe = false;
    }
    if (this.showFilterRang &&
        !this.rangToggler.nativeElement.contains(target) &&
        !this.rangFilter.nativeElement.contains(target)) {
      this.showFilterRang = false;
    }
    if (this.showFilterTauxCTB &&
        !this.tauxCTBToggler.nativeElement.contains(target) &&
        !this.tauxCTBFilter.nativeElement.contains(target)) {
      this.showFilterTauxCTB = false;
    }
    if (this.showFilterMinCTB &&
        !this.minCTBToggler.nativeElement.contains(target) &&
        !this.minCTBFilter.nativeElement.contains(target)) {
      this.showFilterMinCTB = false;
    }
    if (this.showFilterMaxCTB &&
        !this.maxCTBToggler.nativeElement.contains(target) &&
        !this.maxCTBFilter.nativeElement.contains(target)) {
      this.showFilterMaxCTB = false;
    }
    if (this.showFilterTauxRUS &&
        !this.tauxRUSToggler.nativeElement.contains(target) &&
        !this.tauxRUSFilter.nativeElement.contains(target)) {
      this.showFilterTauxRUS = false;
    }
    if (this.showFilterMinRUS &&
        !this.minRUSToggler.nativeElement.contains(target) &&
        !this.minRUSFilter.nativeElement.contains(target)) {
      this.showFilterMinRUS = false;
    }
    if (this.showFilterMaxRUS &&
        !this.maxRUSToggler.nativeElement.contains(target) &&
        !this.maxRUSFilter.nativeElement.contains(target)) {
      this.showFilterMaxRUS = false;
    }
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
