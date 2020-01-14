class App {

	constructor(container) {
		this.container = container;
		this.scheduleSelector = new ScheduleSelector();
		this.viewSchedule = new ViewSchedule();
		this.viewSchedule.addScheduleCallback = this.viewScheduleAddScheduleCallback.bind(this)
	}

	viewScheduleAddScheduleCallback() {
		return this.scheduleSelector.selectedSchedule
	}

}