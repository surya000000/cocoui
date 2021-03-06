<template>
    <div :class="['coco-ui-grid', showHeader ? 'with-header' : 'without-header']">
        <div
            @click="e => $emit('on-column-click', { dayNumber, index }, e)"
            v-for="(dayNumber, index) in totalDays"
            :key="dayNumber"
            :class="[`full-calendar-day-number day-${dayNumber}`, defaultHolidayDays.includes(getDayName(dayNumber)) ? 'calendar-holiday-wrapper' : '']"
        >
            <div
                class="header"
                :class="[activeDayNumber === dayNumber  ? 'calendar-active-header' : '', defaultHolidayDays.includes(getDayName(dayNumber)) ? 'calendar-holiday-header' : '']"
                v-if="showHeader"
                @click="(e) => headerClick(dayNumber, e)"
            >
                <p>
                    {{ dayNumber }}
                </p>
                <p>
                    {{ getDayName(dayNumber) }}
                </p>
            </div>
            <div
                :class="[getBorderRadius(event, dayNumber), 'event']"
                v-for="event in getDateEvents(dayNumber)"
                :key="event.label"
                :style="eventStyles"
            >
                {{ event.label }}
                <span class="event-icon">
                    {{ event.icon }}
                </span>
            </div>
        </div>
    </div>
</template>
<script>
import { isJSON, flatMap } from "ui-helpers";

const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const dateEventsInterface = {
    data: { from: new Date(), to: new Date() },
    events: [],
};

const eventInterface = {
    eventGroup: "",
    styles: {
        height: "8px",
    },
};

export default {
    name: "Calendar",
    data() {
        return {
            activeDayNumber: new Date().getDay(),
        };
    },
    props: {
        year: {
            type: [String, Number],
            default: new Date().getFullYear(),
        },
        month: {
            type: [String, Number],
            default: new Date().getMonth(),
        },
        showHeader: {
            type: Boolean,
            default: true,
        },
        dateEvents: {
            type: Array,
            default: () => [],
        },
        eventStyles: {
          type: Object,
          default: () => ({})
        },
        defaultHolidayDays: {
          type: Array,
          default: () => ['Sat']
        }
    },
    computed: {
        defaultStyles() {
            return eventInterface.styles;
        },
        eventGroupNames() {
            return flatMap(this.dateEvents, "events.groupName");
        },
        totalDays() {
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getMonth
            // geMonth returns from 0 index
            return new Date(this.year, this.month + 1, 0).getDate();
        },
    },
    mounted() {
      this.headerClick(this.activeDayNumber)
    },
    methods: {
        headerClick(dayNumber, e) {
            this.activeDayNumber = dayNumber;
            this.$emit("on-header-click", this.activeDayNumber);
        },
        getDateEvents(dayNumber) {
            const currentDate = new Date(this.year, this.month, dayNumber);
            const currentDateEvents = this.dateEvents.filter(data => currentDate.toDateString() === (new Date(data.date)).toDateString()) || [];
            return currentDateEvents;
        },
        getBorderRadius(event, dayNumber) {
            const nextEvent = this.getDateEvents(dayNumber + 1);
            const previousEvent = this.getDateEvents(dayNumber - 1);
            let returnClass = ''
            const currentDate = new Date(this.year, this.month, dayNumber);
            if (currentDate.toDateString() === new Date(event.date).toDateString() && nextEvent.length === 0) {
                returnClass =  `${returnClass} border-rounded-right`;
            }
            if (currentDate.toDateString() === new Date(event.date).toDateString() && previousEvent.length === 0) {
                returnClass = `${returnClass} border-rounded-left`;
            }
            return returnClass;
        },
        getDayName(dayNumber) {
            const dayIndex = new Date(this.year, this.month, dayNumber).getDay();
            return weekday[dayIndex];
        },
    }
};
</script>
