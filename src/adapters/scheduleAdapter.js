const ScheduleAdapter = (function() {
	//Singleton "Class Variable" - a way around JS not having class variables
	let instance = null

	return class {
		static get instance() {
			if (instance === null) { 
				instance = new this() 
			}
			return instance
		}

		constructor() {
			if (instance !== null) {
				return instance
			} else {
				this.token = null
				instance = this
				return instance
			}
		}

		get baseURL() {
			return `http://localhost:3000/api/v1`
		}

		get schedulesURL() {
			return `${this.baseURL}/schedules`
		}

		scheduleURL(id) {
			return `${this.shedulesURL}/${id}`
		}

		get headers() {
			const stdHeader = {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			}
			if (this.token === null) {
				return stdHeader
			}
			return {
				...stdHeader,
				'Authorization': `Bearer ${this.token}`
			}
		}

		async getSchedules() {
			const res = await fetch(this.schedulesURL)
			this.checkStatus(res)
			return await res.json()
		}

		async getSchedule(id) {
			const res = await fetch(this.scheduleURL(id))
			this.checkStatus(res)
			return await res.json()
		}

		async newSchedule(titleValue, daysValue, timeValue, instrumentValue, areaValue) {
			const schedule = {
				title: titleValue,
				practice_days: daysValue,
				practice_time: parseInt(timeValue),
				instrument: instrumentValue,
				practice_areas: areaValue
			}
			const res = await fetch(this.schedulesURL, {
				method: 'POST',
				headers: this.headers,
				body: JSON.stringify({schedule})
			})
			this.checkStatus(res)
			return await res.json()
		}

		checkStatus(res) {
			if (res.status > 299 || res.status < 200) {
				throw new Error(res.status)
			}
		}

	}

})()