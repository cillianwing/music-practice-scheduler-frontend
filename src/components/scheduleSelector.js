class ScheduleSelector {

	constructor() {
		this.schedules = [];
		$('#new-schedule-form').hide();
		this.initBindingAndEventListeners();
		this.fetchAndLoadSchedules();
		this.selectedSchedule = null;
	}

	initBindingAndEventListeners() {
		this.container = document.querySelector('#schedule-selector');
		this.allSchedulesContainer = document.querySelector('#all-schedules')
		this.newButton = document.querySelector('a#new-schedule')

		this.newScheduleTitle = $('#schedule-title')
		this.newSchedulePracticeDays = $('#practice-days')
		this.newSchedulePracticeTime = $('#practice-time')
		this.newScheduleInstrument = $('#instrument')
		this.newSchedulePracticeAreas = $('#practice-areas')

		this.allSchedulesContainer.addEventListener('click', this.selectScheduleHandler.bind(this))
		this.newButton.addEventListener('click', this.newScheduleHandler.bind(this))
	}

	selectScheduleHandler(e) {
		if (e.target.classList.contains('select-schedule')) {
			const id = parseInt(e.target.dataset.id)
			const selection = this.schedules.find(schedule => schedule.id === id)
			if (selection === this.selectedSchedule) {
				e.target.parentElement.style.background = 'white'
				this.selectedSchedule = null
			} else if (this.selectedSchedule !== null) {
				const scheduleContainer = Array.from(this.allSchedulesContainer.children).find(con => {
					const button = con.querySelector('button#select-schedule')
					return parseInt(button.dataset.id) === this.selectedSchedule.id
				})
				scheduleContainer.querySelector('div.card-body').style.background = 'white'
				e.target.parentElement.style.background = '#f2e9aa'
				this.selectedSchedule = selection
			} else {
				e.target.parentElement.style.background = '#f2e9aa'
				this.selectedSchedule = selection
			}
		}
	}

	newScheduleHandler(e) {
		$('#new-schedule-form').show();
		$('h3#page-header').hide();

		this.newForm = document.querySelector('#new-schedule-form')
		this.newCancel = document.querySelector('a#new-schedule-cancel')

		$('#practice-days').change(function() {
			let days = $(this).val();
			if (days.length !== 0) {
				$('#time-group').show();
			} else {
				$('#time-group').hide();
			}
		})
		$('#practice-days').trigger("change")

		$('#instrument').change(function() {
			let instr = $(this).val();
			if (instr !== '') {
				$('#practice-areas-group').show();
			} else {
				$('#practice-areas-group').hide();
			}
		})
		$('#instrument').trigger("change")

		this.newForm.addEventListener('submit', this.createNewSchedule.bind(this))
		this.newCancel.addEventListener('click', () => {
			$('#new-schedule-form').hide();
			$('h3#page-header').show();			
		})
	}	

	async createNewSchedule(e) {
		e.preventDefault();
		const titleValue = this.newScheduleTitle.val()
		const daysValue = this.newSchedulePracticeDays.val().join(', ')
		const timeValue = this.newSchedulePracticeTime.val()
		const instrumentValue = this.newScheduleInstrument.val()
		const areaValue = this.newSchedulePracticeAreas.val().join(', ')
		
		const newSchedule = await ScheduleAdapter.instance.newSchedule(titleValue, daysValue, timeValue, instrumentValue, areaValue)
		this.schedules.push(new Schedule(newSchedule))
		$('#new-schedule-form').hide();
		$('a#new-schedule').show();
		return this.render()
	}	

	async fetchAndLoadSchedules() {
		this.schedules = await Schedule.retrieveAll();
		if (typeof(this.schedules) !== 'string') {
			this.render();	
		}
	}

	render() {
		this.allSchedulesContainer.innerHTML = this.schedules.map(schedule => schedule.html).join('');
	}

}