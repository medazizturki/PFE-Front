import { Component, OnInit, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { JourFerieService } from '../jour-ferie.service';
import { Router } from '@angular/router';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';


interface MyEventProps {
  official: boolean;
  id?: number;
}

@Component({
  selector: 'app-jour-ferie',
  templateUrl: './jour-ferie.component.html',
  styleUrls: ['./jour-ferie.component.css'],
  providers: [ConfirmationService, MessageService]
})


export class JourFerieComponent implements OnInit {
  @ViewChild('fullCalendar') calendarComponent!: FullCalendarComponent;

  displayModal = false;
  calendarPlugins = [dayGridPlugin];
  calendarOptions: any;
  calendarEvents: any[] = [];

  jourFerieForm!: FormGroup;
  joursFeriesDynamiques: any[] = [];
  user: any = JSON.parse(localStorage.getItem('user') || '{}');

  constructor(
    private jourFerieService: JourFerieService,
    private router: Router,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.calendarOptions = {
      plugins: this.calendarPlugins,
      initialView: 'dayGridMonth',
      events: [],
      height: 450,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth'
      },
      locale: 'fr',
      dateClick: (arg: any) => {
        this.jourFerieForm.patchValue({ date: arg.dateStr });
        this.displayModal = true;
      }
    };

    this.loadAllEvents();
  }

  initForm(): void {
    this.jourFerieForm = this.fb.group({
      date: ['', Validators.required],
      descriptionfr: ['', [Validators.required, Validators.minLength(2)]],
      resumefr: [''],
      descriptionar: [''],
      resumear: [''],
      descriptionen: [''],
      resumeen: ['']
    });
  }

loadAllEvents(): void {
  this.jourFerieService.getAll().subscribe(data => {
    this.joursFeriesDynamiques = data;

    const events = data.map((j: any) => ({
      title: j.descriptionfr,
      date: j.date,
      allDay: true,
      backgroundColor: '#023a8d',
      borderColor: '#023a8d',
      textColor: 'white',
      extendedProps: {
        id: j.id,
        official: false
      }
    }));

    const today = new Date().toISOString().split('T')[0];
    events.push({
  title: "Aujourd'hui",
  date: today,
  backgroundColor: '#28a745',
  borderColor: '#28a745',
  textColor: 'white',
  allDay: true,
  extendedProps: {
    id: 'today',
    official: true
  }
});


    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);
    years.forEach(year => {
      const officialHolidays = [
        { date: `${year}-03-20`, title: 'Fête de l’Indépendance' },
        { date: `${year}-04-09`, title: 'Jour des Martyrs' },
        { date: `${year}-05-01`, title: 'Fête du Travail' },
        { date: `${year}-07-25`, title: 'Fête de la République' },
        { date: `${year}-08-13`, title: 'Fête de la Femme' },
        { date: `${year}-10-15`, title: 'Fête de l’Évacuation' },
        { date: `${year}-12-17`, title: 'Révolution Tunisienne' }
      ];

      officialHolidays.forEach(h => {
        events.push({
          title: h.title,
          date: h.date,
          allDay: true,
          backgroundColor: '#023a8d',
          borderColor: '#023a8d',
          textColor: 'white',
          extendedProps: {
            id: null, // or generate a fake unique ID if needed
            official: true
          }
        });
      });
    });

    // ✅ Remove all current events and add new ones
    const api = this.calendarComponent.getApi();
    api.removeAllEvents();
    events.forEach(e => api.addEvent(e));
  });
}


  addTodayMarker(): void {
    const today = new Date().toISOString().split('T')[0];
    this.calendarEvents.push({
      title: 'Aujourd\'hui',
      date: today,
      color: '#28a745'
      
    });
  }

  addOfficialTunisianHolidays(): void {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

    years.forEach(year => {
      const holidays = [
        { date: `${year}-03-20`, title: 'Fête de l’Indépendance' },
        { date: `${year}-04-09`, title: 'Jour des Martyrs' },
        { date: `${year}-05-01`, title: 'Fête du Travail' },
        { date: `${year}-07-25`, title: 'Fête de la République' },
        { date: `${year}-08-13`, title: 'Fête de la Femme' },
        { date: `${year}-10-15`, title: 'Fête de l’Évacuation' },
        { date: `${year}-12-17`, title: 'Révolution Tunisienne' }
      ];

      this.calendarEvents.push(...holidays.map(h => ({
        title: h.title,
        date: h.date,
        backgroundColor: '#023a8d',
        borderColor: '#023a8d',
        textColor: 'white',
        extendedProps: { official: true }
      })));
    });
  }

  refreshCalendar(): void {
    const api = this.calendarComponent.getApi();
    api.removeAllEvents();
    this.calendarEvents.forEach(e => api.addEvent(e));
  }

  confirmAddJour(): void {
    if (this.jourFerieForm.invalid) return;

    this.confirmationService.confirm({
      message: 'Confirmer l\'ajout de ce jour férié ?',
      header: 'Confirmation',
      accept: () => this.addJour()
    });
  }

  addJour(): void {
    this.jourFerieService.add(this.jourFerieForm.value).subscribe(() => {
      this.jourFerieForm.reset();
      this.displayModal = false;
      this.messageService.add({ severity: 'success', summary: 'Ajouté', detail: 'Jour ajouté' });
      this.loadAllEvents();
    });
  }

  
  deleteJour(id: number): void {
  this.jourFerieService.delete(id).subscribe(() => {
    // ✅ Remove from dynamic list
    this.joursFeriesDynamiques = this.joursFeriesDynamiques.filter(j => j.id !== id);

    // ✅ Remove from calendar
    const api = this.calendarComponent.getApi();
    const events = api.getEvents();

    events.forEach(event => {
      const props = event.extendedProps;

      // We assume official holidays have 'official: true'
      // and dynamic holidays (added by user) have 'official: false'
      if (props && props['id'] === id && props['official'] === false) {
        event.remove();
      }
    });

    // ✅ Toast notification
    this.messageService.add({
      severity: 'success',
      summary: 'Supprimé',
      detail: 'Jour supprimé'
    });
  });
}


confirmDeleteJour(id: number): void {
  this.confirmationService.confirm({
    message: 'Supprimer ce jour férié ?',
    header: 'Confirmation',
    icon: 'pi pi-exclamation-triangle',
    accept: () => this.deleteJour(id)
  });
}




  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getUserImagePath(): string {
    if (this.user.image) return `/assets/uploads-images/${this.user.image}`;
    if (this.user.attributes?.image?.[0]) return `/assets/uploads-images/${this.user.attributes.image[0]}`;
    if (this.user.attributes?.picture) return `/assets/uploads-images/${this.user.attributes.picture}`;
    return '';
  }
}
