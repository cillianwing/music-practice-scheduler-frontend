class ViewSchedule {

	constructor() {
		this.schedule = null
		this.initBindingsAndEventListeners()
	}

	static get ScheduleDecorator() {
		return class{
			constructor(schedule) {
				this.title = schedule.title
				this.practiceDays = schedule.practiceDays
				this.practiceTime = schedule.practiceTime
				this.instrument = schedule.instrument
				this.practiceAreas = schedule.practiceAreas
				this.scheduleComponents = this.getScheduleComponents
				this.container = document.querySelector('#view-schedule')
			}

			get getScheduleComponents() {
				let updatedPracticeAreas = this.practiceAreaBlocks
				let daysArray = this.practiceDays.split(", ")
				let time = this.practiceTime
				
				let dayObj = {}
				daysArray.forEach( day => {
					dayObj[day] = []
				})

				for (let key in dayObj) {
				  for (let i = 0; i < time/30; i++) {
				  	let el = { 'sesh': '', 'complete': false }
				    el['sesh'] = updatedPracticeAreas.shift()
				    dayObj[key].push(el)
				  }
				}				

				return dayObj
			}

			get renderScheduleComponents() {
				this.html(this.scheduleComponents)
			}			

			get practiceBlocks() {
				let daysArray = this.practiceDays.split(", ")
				let timeInt = parseInt(this.practiceTime)
				return (daysArray.length * (timeInt / 30))
			}

			get practiceAreaBlocks() {
				let areasArray = this.practiceAreas.split(", ")
				if (areasArray.length === this.practiceBlocks) {
					return areasArray
				} else if (areasArray.length > this.practiceBlocks) {
					return this.condensedPracticeAreasList
				} else {
					return this.duplicatePracticeAreasList
				}
			}

			get condensedPracticeAreasList() {
				let practiceBlocks = this.practiceBlocks
				let areasArray = this.practiceAreas.split(", ")
				let newArray = []
				for (let i = 0; i < practiceBlocks; i++) {
					let item = areasArray[Math.floor(Math.random()*areasArray.length)]
					newArray.push(item)
					let index = areasArray.indexOf(item)
					if (index > -1) {
						areasArray.splice(index, 1)
					}
				}
				return newArray
			}

			shuffle(array) {
				// Fisher-Yates Shuffle: Walk array in reverse and swap each el with random one before it
				for (let i = array.length - 1; i > 0; i--) {
					const j = Math.floor(Math.random() * (i + 1));

					[array[i], array[j]] = [array[j], array[i]];
				}
				return array		
			}

			get duplicatePracticeAreasList() {
				let practiceBlocks = this.practiceBlocks 
				let areasArray = this.practiceAreas.split(', ')
				let shuffled = this.shuffle(areasArray)
				let newArray = []
				for (let i = 0; i < practiceBlocks; i++) {
					let index = i % areasArray.length
					newArray.push(shuffled[index])
				}
				return newArray
			}

			html(obj) {
				// html that will be added to #view-schedule container
				let viewDiv = ''
				for (let key in obj) {
					viewDiv += `
						<h3 class="text-center">${key}</h3>
						<h5 class="text-center">${this.instrument} Practice</h5>
						<div class="row flex-row flex-nowrap pb-2 justify-content-center" style="overflow-x: auto">`
					obj[key].forEach( (area, index) => {
						if (!area['completed']) {
							viewDiv += `
								<div class="col-3">
									<div class="card card-block">
										<div class="schedule-border" style="background: ''">
											<img src="src/components/images/${area['sesh'].split(/[ ,/]+/)[0]}.jpg" class="card-img-top">
											<div class="card-body">
												<h5 class="card-title text-center">${area['sesh']}: 30 min.</h5>
											</div>
											<div class="completed-button">
												<button id="completed-button-${key.toLowerCase()}-${area['sesh']}-${index}" class="completed-button btn btn-primary btn-block">Practice Complete?</button>
											</div>
										</div>
									</div>
								</div>
							`							
						} else {
							viewDiv += `
								<div class="col-3">
									<div class="card card-block">
										<div class="schedule-border" style="background: ''">
											<img src="src/components/images/${area['sesh'].split(/[ ,/]+/)[0]}.jpg" class="card-img-top">
											<div class="card-body">
												<h5 class="card-title text-center">${area['sesh']}: 30 min.</h5>
											</div>
											<div class="completed-button">
												<button id="completed-button-${key.toLowerCase()}-${area['sesh']}-${index}" class="completed-button btn btn-success btn-block" disabled>Complete</button>
											</div>
										</div>
									</div>
								</div>
							`										
						}
					})
					viewDiv += `</div>`
				}
				this.container.innerHTML = viewDiv
				this.container.addEventListener('click', this.updateCompletedButton.bind(this))
			}

			updateCompletedButton(e) {
				if (e.target.classList.contains('completed-button')) {
					const day = e.target.id.split("-")[2]
					const session = e.target.id.split("-")[3]
					const idx = parseInt(e.target.id.split("-")[4])
					const parentDiv = e.target.parentElement

					for (let key in this.scheduleComponents) {
						if (key.toLowerCase() === day) {
							this.scheduleComponents[key].forEach( (el, index) => {
								if (el['sesh'] === session && index === idx) {
									e.target.parentElement.innerHTML = `<button id="completed-button-${day}-${session}-${idx}" class="completed-button btn btn-success btn-block" disabled>Complete</button>`
									el['completed'] = true
									parentDiv.parentElement.style.background = '#f2e9aa'
								}
							})
						}
					}
				}
			}
		
		}
	}

	initBindingsAndEventListeners() {
		this.container = document.querySelector('#view-schedule')

		document.addEventListener('click', e => {
			if (e.target.classList.contains('select-schedule')) {
				this.handleViewClick.call(this)
			}
		})
	}

	addSchedule(schedule) {
		const decSchedule = new ViewSchedule.ScheduleDecorator(schedule)
		this.schedule = decSchedule
		this.render()
	}

	handleViewClick(e) {
		const schedule = this.addScheduleCallback()

		if (schedule) {
			this.addSchedule(schedule)
		} else {
			this.container.innerHTML = ''
		}
	}

	render() {
		this.schedule.renderScheduleComponents
	}

}