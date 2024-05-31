<template>
  <div class="container">
    <div class="inner-container">
      <FullCalendar ref="fullCalendar" :options="calendarOptions" />
    </div>

    <b-modal v-model="modalShow" hide-footer title="일정">
      <b-form @submit.stop.prevent="modalMode === 'edit' ? updateEvent() : addEvent()">
        <b-form-group label="일정 내용" label-for="event-title">
          <b-form-input id="event-title" v-model="eventTitle" required></b-form-input>
        </b-form-group>
        <b-form-group label="카테고리" label-for="event-category">
          <b-form-select id="event-category" v-model="eventCategory" :options="categories" required></b-form-select>
        </b-form-group>
        <div class="d-flex justify-content-end">
          <b-button type="submit" class="mx-1" variant="primary">작성 완료</b-button>
          <b-button v-if="modalMode === 'edit'" variant="danger" @click="deleteEvent">삭제</b-button>
          <b-button variant="secondary" class="mx-1" @click="modalShow = false;">닫기</b-button>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import { BModal, BForm, BFormGroup, BFormInput, BFormSelect, BButton } from 'bootstrap-vue-3';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import holidays from './holidays.json'; // 경로를 적절히 조정하세요
import koLocale from '@fullcalendar/core/locales/ko';
import axios from 'axios';

export default {
  components: {
    FullCalendar,
    BModal,
    BForm,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BButton
  },
  data() {
    return {
      modalShow: false,
      modalMode: 'add', // 모달 창 모드를 추가(add) 또는 수정(edit)으로 구분
      currentEventId: null, // 현재 수정 중인 이벤트의 ID
      calendarOptions: {
        plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        initialView: 'dayGridMonth',
        locale: koLocale,
        headerToolbar: {
          start: 'prev next',
          center: 'title',
          end: 'today'
        },
        editable: true,
        selectable: true,
        // selectMirror: true,
        expandRows: true,
        height: 'auto',
        select: this.handleDateSelect,
        events: [], // events 배열 초기화
        dayCellDidMount: this.renderDayCell,
        dayCellClassNames: this.addWeekendClass,
        eventContent: this.renderEventContent,
        eventClick: this.handleEventClick, // 이벤트 클릭 핸들러 추가
        eventDrop: this.handleEventDrop, // 이벤트 드래그 앤 드롭 핸들러 추가
        eventResize: this.handleEventResize // 이벤트 리사이즈 핸들러 추가
      },
      eventTitle: '',
      eventCategory: null,
      selectedDate: null,
      categories: [
        { value: null, text: '카테고리 선택' },
        { value: 'work', text: '사무실일정', color: '#b3b3b3' },
        { value: 'real', text: '부동산등기', color: '#ffd700' },
        { value: 'personal', text: '개인', color: '#c2ddff' },
      ],
      holidayData: [],
      user: null
    }
  },
  created() {
    this.loadHolidays();
    this.loadUser();
    this.loadEvents();
  },
  methods: {
    async loadHolidays() {
      const currentYear = new Date().getFullYear();
      const years = [currentYear, currentYear + 1, currentYear + 2, currentYear + 3];
      let holidayEvents = [];

      years.forEach(year => {
        const holidaysForYear = holidays[year] || {};

        Object.entries(holidaysForYear).forEach(([holidayName, dates]) => {
          if (Array.isArray(dates)) {
            dates.forEach(date => {
              let adjustedDate = new Date(date);
              adjustedDate.setDate(adjustedDate.getDate() - 1);
              holidayEvents.push({
                date: adjustedDate.toISOString().split('T')[0],
                holidayName
              });
            });
          } else {
            let adjustedDate = new Date(dates);
            adjustedDate.setDate(adjustedDate.getDate() - 1);
            holidayEvents.push({
              date: adjustedDate.toISOString().split('T')[0],
              holidayName
            });
          }
        });
      });

      this.holidayData = holidayEvents;
    },
    async loadUser() {
      try {
        const response = await axios.get('/api/user/me');
        this.user = response.data;
      } catch (error) {
        console.error('사용자 정보를 불러오는 중 오류 발생:', error);
      }
    },
    async loadEvents() {
      try {
        const response = await axios.get('/api/events');
        const events = response.data.map(event => ({
          ...event,
          title: event.title // 여기에서 title을 설정합니다.
        }));
        this.calendarOptions.events = events;
      } catch (error) {
        console.error('이벤트를 불러오는 중 오류 발생:', error);
      }
    },
    handleDateSelect(selectInfo) {
      this.selectedDate = selectInfo.startStr;
      this.eventTitle = '';
      this.eventCategory = null;
      this.modalMode = 'add';
      this.modalShow = true;
    },
    handleEventClick(clickInfo) {
      this.currentEventId = clickInfo.event.id;
      const event = clickInfo.event;
      this.eventTitle = event.title;
      this.eventCategory = event.extendedProps.category;
      this.selectedDate = event.startStr;
      this.modalMode = 'edit';
      this.modalShow = true;
    },
    async handleEventDrop(info) {
      const formatDate = (date) => {
        if (!date) return null;
        const offset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - offset);
        return localDate.toISOString().split('T')[0];
      };

      const updatedEvent = {
        id: info.event.id,
        title: info.event.title,
        start: formatDate(info.event.start),
        end: formatDate(info.event.end),
        allDay: info.event.allDay,
        category: info.event.extendedProps.category,
        userRole: this.user ? this.user.role : '',
        userName: this.user ? this.user.name : '',
        office_id: this.user.office_id,
        color: info.event.backgroundColor
      };
      console.log(updatedEvent);

      try {
        await axios.put(`/api/events/${info.event.id}`, updatedEvent);
      } catch (error) {
        console.error('이벤트 드롭 업데이트 중 오류 발생:', error);
        info.revert();
      }
    },
    async handleEventResize(info) {
      const formatDate = (date) => {
        if (!date) return null;
        const offset = date.getTimezoneOffset() * 60000;
        const localDate = new Date(date.getTime() - offset);
        return localDate.toISOString().split('T')[0];
      };

      const updatedEvent = {
        id: info.event.id,
        title: info.event.title,
        start: formatDate(info.event.start),
        end: formatDate(info.event.end),
        allDay: info.event.allDay,
        category: info.event.extendedProps.category,
        userRole: this.user ? this.user.role : '',
        userName: this.user ? this.user.name : '',
        office_id: this.user.office_id,
        color: info.event.backgroundColor
      };

      try {
        await axios.put(`/api/events/${info.event.id}`, updatedEvent);
      } catch (error) {
        console.error('이벤트 리사이즈 업데이트 중 오류 발생:', error);
        info.revert();
      }
    },
    async addEvent() {
      if (this.eventTitle && this.eventCategory) {
        const selectedCategory = this.categories.find(category => category.value === this.eventCategory);
        const newEvent = {
          title: this.eventTitle,
          start: this.selectedDate,
          allDay: true,
          category: this.eventCategory,
          userRole: this.user ? this.user.role : '',
          userName: this.user ? this.user.name : '',
          office_id: this.user.office_id,
          color: selectedCategory.color
        };

        try {
          const response = await axios.post('/api/events', newEvent);
          newEvent.id = response.data.id;
          this.$refs.fullCalendar.getApi().addEvent(newEvent);
          this.eventTitle = '';
          this.eventCategory = null;
          this.modalShow = false;
        } catch (error) {
          console.error('이벤트를 추가하는 중 오류 발생:', error);
        }
      }
    },
    async updateEvent() {
      if (this.eventTitle && this.eventCategory && this.currentEventId) {
        const selectedCategory = this.categories.find(category => category.value === this.eventCategory);
        const updatedEvent = {
          title: this.eventTitle,
          start: this.selectedDate,
          allDay: true,
          category: this.eventCategory,
          userRole: this.user ? this.user.role : '',
          userName: this.user ? this.user.name : '',
          office_id: this.user.office_id,
          color: selectedCategory.color

        };

        try {
          await axios.put(`/api/events/${this.currentEventId}`, updatedEvent);
          const event = this.$refs.fullCalendar.getApi().getEventById(this.currentEventId);
          if (event) {
            event.setProp('title', this.eventTitle);
            event.setProp('color', this.categories.find(category => category.value === this.eventCategory).color);
            event.setExtendedProp('category', this.eventCategory);
            event.setExtendedProp('userRole', this.user ? this.user.role : '');
            event.setExtendedProp('userName', this.user ? this.user.name : '');
          }
          this.eventTitle = '';
          this.eventCategory = null;
          this.modalShow = false;
          this.currentEventId = null;
        } catch (error) {
          console.error('이벤트를 업데이트하는 중 오류 발생:', error);
        }
      }
    },
    async deleteEvent() {
      if (this.currentEventId) {
        try {
          await axios.delete(`/api/events/${this.currentEventId}`);
          const event = this.$refs.fullCalendar.getApi().getEventById(this.currentEventId);
          if (event) {
            event.remove();
          }
          this.eventTitle = '';
          this.eventCategory = null;
          this.modalShow = false;
          this.currentEventId = null;
        } catch (error) {
          console.error('이벤트를 삭제하는 중 오류 발생:', error);
        }
      }
    },
    renderDayCell(arg) {
      const holiday = this.holidayData.find(h => h.date === arg.date.toISOString().split('T')[0]);
      if (holiday) {
        const holidayElement = document.createElement('div');
        holidayElement.classList.add('holiday-name');
        holidayElement.innerText = holiday.holidayName;
        arg.el.appendChild(holidayElement);
        arg.el.style.backgroundColor = '#ffcccc';
      }
    },
    addWeekendClass(arg) {
      const day = arg.date.getDay();
      if (day === 0 || day === 6) { // Sunday or Saturday
        return 'fc-weekend';
      }
      return '';
    },
    renderEventContent(eventInfo) {
      const { title } = eventInfo.event;
      const { userRole, userName, category } = eventInfo.event.extendedProps;
      let htmlContent = `<div style="color: black;">${title}</div>`;
      if (category === 'personal') {
        htmlContent += `<div style="font-size: 0.8em; color: grey;">(${userRole} ${userName})</div>`;
      }
      return { html: htmlContent };
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.inner-container {
  width: 80%;
  min-width: 750px;
  margin-bottom: 50px;
}

/* Scoped styles for FullCalendar to remove underline */
:deep(.fc .fc-daygrid-day-number) {
  text-decoration: none !important;
}

:deep(.fc .fc-toolbar-title) {
  text-decoration: none !important;
}

:deep(.fc-daygrid-day-top a) {
  text-decoration: none !important;
  color: black;
  font-size: 14px;
}

:deep(.fc .fc-daygrid-day-frame) {
  text-decoration: none !important;
}

:deep(.fc .fc-col-header-cell-cushion) {
  text-decoration: none !important;
  color: black;
}

/* Additional style to ensure event text color is black */
:deep(.fc-event-title) {
  color: black !important;
}

/* Scoped styles for FullCalendar to remove underline */
::v-deep(.fc .fc-daygrid-day) {
  position: relative;
}

/* Modified style for .holiday-name */
::v-deep .holiday-name {
  position: absolute;
  bottom: 0;
  right: 0;
  font-size: 10px;
  color: gray;
}

/* Style for weekends */
::v-deep .fc-weekend {
  background-color: #f0f0f0;
}
</style>
