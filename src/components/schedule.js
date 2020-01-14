class Schedule {

	static async retrieveAll() {
		try{
			const scheduleObjs = await ScheduleAdapter.instance.getSchedules();
			return scheduleObjs.map(obj => new this(obj));
		}catch(err) {
			// alert(`The request failed with error ${err}.`);
			return "No schedules have been created yet.";
		}
	}

	constructor(params) {
		const {id, title, practice_days, practice_time, instrument, practice_areas} = params
		this.id = id
		this.title = title
		this.practiceDays = practice_days
		this.practiceTime = practice_time
		this.instrument = instrument
		this.practiceAreas = practice_areas
	}

	// will need static get methods for any calculating and changes to the constructed object
	get html() {
		return (`
			<div class="col-3">
				<div class="card card-block">
					<div class="schedule-border">
						<img src="src/components/images/${this.instrument}.jpg" class="card-img-top">
						<div class="card-body">
							<h4 class="card-title text-center">${this.title}</h4>
							<p class="card-text"><strong>Instrument:</strong>  ${this.instrument}</p>
							<p class="card-text" style="height: 50px; overflow-y: auto"><strong>Practice Days:</strong> ${this.practiceDays}</p>
							<p class="card-text"><strong>Hours of Practice/Day:</strong>  ${this.practiceTime} hrs.</p>
							<p class="card-text" style="height: 50px; overflow-y: auto"><strong>Areas of Practice:</strong>  ${this.practiceAreas}</p>
							<button id="select-schedule" class="select-schedule btn btn-primary btn-block" data-id="${this.id}">Select</button>
						</div>
					</div>
				</div>
			</div>
		`)
	}

}