// import preact
import { h, render, Component } from 'preact';
// import stylesheets for ipad & button
import style from './style';
import style_iphone from '../button/style_iphone';
// import jquery for API calls
import $ from 'jquery';
// import the Button component
import Button from '../button';

export default class Iphone extends Component {
//var Iphone = React.createClass({

	// a constructor with initial set states
	constructor(props){
		super(props);
		// temperature state
		this.state.temp = "";
		// button display state
		this.setState({ display: true });
	}

	// a call to fetch weather data via wunderground
	fetchWeatherData = () => {
		// API URL with a structure of : ttp://api.wunderground.com/api/key/feature/q/country-code/city.json
		var url = "http://api.openweathermap.org/data/2.5/weather?q=London&units=metric&APPID=f351e27ee8069a5b84da52e279320e44";
		$.ajax({
			url: url,
			dataType: "jsonp",
			success : this.parseResponse,
			error : function(req, err){ console.log('API call failed ' + err); }
		})
		// once the data grabbed, hide the button
		this.setState({ display: false });
	}
	dateBuilder = (d) => {
		let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
		let day = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
		let days = days[d.getDay()];
		let date = d.getDate();
		let month = months[d.getMonth()];
		let year = d.getFullYear();
		return `${day} ${date} ${month} ${year}`
	}
	// the main render method for the iphone component
	render() {
		
		// check if temperature data is fetched, if so add the sign styling to the page
		const tempStyles = this.state.temp ? `${style.temperature} ${style.filled}` : style.temperature;
		const tempPercent = this.state.temp ? `${style.temperature} ${style.percent}`: style.temperature;
		const tagsLine = this.state.temp ? `${style.tagsLine} ${style.tagsLine}`: null; 
		// display all weather data
		return (
			<main>
				<div class={ style.container }>
					
					<div class={ style.header }>
						<div className="search-box">
						<input 
							type="text"
							className="search-bar"
							placeholder="Search..."	
						/>
						</div>
							<div class={ style.city }>{ this.state.locate }</div>	
							<div class={ style.conditions }>{ this.state.cond }<img class={style.icon}src={this.state.icon}/></div>
							<div class={ tempPercent }>{ this.state.humid } </div><tag class={tagsLine}>humidity</tag>
							<div class={ tempPercent }>{ this.state.clouds }</div><tag class={tagsLine}>cloudiness</tag>
							<span class={ tempStyles }>{ this.state.temp } </span> <tag class={tagsLine}>temperature</tag>
							
						</div>
						<div class={ style.details }></div>
						<div class= { style_iphone.container }> 
							{ this.state.display ? <Button class={ style_iphone.button } clickFunction={ this.fetchWeatherData }/ > : null }
						</div>
				</div>
			</main>
		);
	}
	componentDidMount() {/*
        if (!navigator.geolocation){
            this.setState({statusText: 'Your browser does not support geolocation...'});
        }
        else{
            navigator.geolocation.getCurrentPosition((position) => {
            var lat = position.coords.latitude;
            var longitude = position.coords.longitude;
            this.setState({longitude: longitude, latitude: lat});
            console.log('Successfully found you at ' + this.state.latitude + ',' + this.state.longitude);
            this.fetchWeatherData(this.state.latitude, this.state.longitude);
            this.fetchPlaces(this.state.latitude, this.state.longitude);
            }, this.errorPosition);
        }
		*/
    }


	parseResponse = (parsed_json) => {
		var cloudPercent = parsed_json['clouds']['all'];
		var location = parsed_json['name'];
		var temp_c = Math.round(parsed_json['main']['temp']);
		var conditions = parsed_json['weather']['0']['description'];
		var humidity = parsed_json['main']['humidity'];
		const iconName = parsed_json['weather']['0']['icon'];
        const iconApi = 'http://openweathermap.org/img/wn/' + iconName + '.png';

		// set states for fields so they could be rendered later on
		this.setState({
			clouds: cloudPercent,
			locate: location,
			temp: temp_c,
			cond : conditions,
			humid: humidity,
			icon: iconApi,
			
		});      
	}
}
