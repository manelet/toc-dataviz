import React, { Component } from 'react';
import qs from 'querystring';

// import Footer from './components/Footer';
import Map from './components/Map/Map';
import Items from './components/Items/Items';
import Detail from './components/Detail/Detail';
import ToggleMap from './components/ToggleMap';
import Loading from './components/Loading/Loading';
import fetchData from './fetchData';

const filterData = ({ data, filters }) =>
  data
    .filter(e => 
      filters.categories
        .filter(c => e.categories.includes(c))
        .length > 0
    )
    .filter(e => e.cost >= filters.price.value[0] && e.cost <= filters.price.value[1]);
  
class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
        panelVisible: "list",
        data: [],
        loadingMessage: "Carregant dades ...",
        filteredData: [],
        map: {
          center: props.cities[0].coords,
          zoom: props.cities[0].zoom,
          pins: []
        },
        detailId: undefined,
        hoveredId: undefined,
        filters: {
          price: {
            min: 0,
            max: Number.MAX_VALUE,
            value: Number.MAX_VALUE
          },
          categories: Object.keys(props.categories).reduce((acc, curr) => {
            acc.push(curr);
            return acc;
          },[])
        },
        categories: props.categories,
        city: props.cities[0],
        cities: props.cities
      };    
  }
  
  isValidCity = city => 
    this.state.cities
      .map(c => c.name)
      .includes(city)

  changeCityByUrl = searchQuery => {
    const { ciutat } = qs.parse(searchQuery.slice(1));
    if (ciutat && this.isValidCity(ciutat)) {
      const city = this.state.cities.find(c => c.name === ciutat);

      this.setState({
        city,
        map: {
          center: city.coords,
          zoom: city.zoom,
          pins: []
        }
      }, () => this.props.switchLoading());
    }    
  }

  componentWillMount () {
    this.changeCityByUrl(this.props.location.search);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      this.changeCityByUrl(nextProps.location.search)
    }    
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.city.name !== this.state.city.name) {
      this.handleData();
    }
  }

  componentDidMount = () => {
    this.handleData();
  }
  
  handleData = async () => {
    const { data } = await fetchData(this.state.city.name);
    const pins = data.length ? data.reduce((acc, curr) => {
      acc.push({
        lat: curr.coords.lat,
        lng: curr.coords.lng,
        id: curr.id
      });

      return acc;
    }, []) : undefined;

    const { min, max } = this.getMinMax(data);

    this.setState({ 
      data,
      filteredData: data, 
      map: { ...this.state.map, pins },
      filters: {
        ...this.state.filters,
        price: {
          min,
          max,
          value: [min, max]
        }
      }
    }, () => this.props.switchLoading());    
  }

  closeDetailCard = () => 
    this.state.detailId ? this.setState({ detailId: undefined }) : null;

  setHovered = hoveredId => this.setState({ hoveredId });

  unsetHovered = () => this.setState({ hoveredId: undefined });

  openCard = detailId => {
    const toggleMap = document.querySelector(".toggle-map");

    if (toggleMap && toggleMap.style.display !== "none") {
      this.switchPanel("list");
    }

    this.setState({ detailId });
  }

  onSliderChange = ([ min, max ]) => {
    const { data } = this.state; 
    const filters = {
        ...this.state.filters,
        price: {
          ...this.state.filters.price,
          value: [min, max] 
        }
    };

    this.setState({
      filteredData: filterData({ data, filters }),
      filters
    });
  }
    
  onCategoryChange = (category, status) => {
    const { filters, data } = this.state;
    let newCategories;

    if (status === "disable") {
      newCategories = filters.categories.filter(c => c !== category);
    }

    if (status === "enable") {
      newCategories = filters.categories.concat(category);
    }

    const newFilters = {
      ...filters, 
      categories: newCategories 
    };

    this.setState({
      filteredData: filterData({ data, filters: newFilters }),
      filters: newFilters
    });
  }

  getMinMax = data => {
    if (!data || !data.length) {
      return { min: 0, max: Number.MAX_VALUE };
    }

    const prices = data.map(d => d.cost);
    const max = Math.max.apply(Math, prices);
    const min = Math.min.apply(Math, prices);
    return { min, max };
  }

  switchPanel = e => {
    const panelVisible = e && e.target ? e.target.textContent.toLowerCase() : e || "list";

    if (panelVisible !== this.state.panelVisible) {
        const panelLeft = document.getElementsByClassName("left-panel")[0];
        const panelRight = document.getElementsByClassName("right-panel")[0];

        panelLeft.classList.toggle("is-visible");
        panelRight.classList.toggle("is-visible");

        this.setState({ panelVisible });
    }
  }

  render() {
    const { city, data, loadingMessage, filteredData, detailId, hoveredId, panelVisible } = this.state;
    const loading = this.props.loading;
    let listingContent;

    if (loading) {
      return <Loading message={loadingMessage} />;
    }

    if (detailId) {
      const detailData = data.find(r => r.id === detailId);
      listingContent = <Detail  {...detailData} closeCard={this.closeDetailCard} />;
    } else {
      listingContent = 
        <Items
          city={city}
          data={filteredData} 
          setHovered={this.setHovered}
          unsetHovered={this.unsetHovered}
          openCard={this.openCard}
          filters={this.state.filters}
          onSliderChange={this.onSliderChange}
          onCategoryChange={this.onCategoryChange}
        />;
    }

    return (
      <div className="App">
        <div className="app-wrapper">
          <div className="left-panel is-visible" style={{ backgroundColor: "#f4f4f4" }}>
            { listingContent }
          </div>
          <div className="right-panel">
            <Map {...this.state.map} openCard={this.openCard} hoveredId={hoveredId} />
          </div>
        </div>
        { !detailId ? 
          <ToggleMap panelVisible={panelVisible} switchPanel={this.switchPanel} /> 
        : null }
      </div>
    );
  }
}

export default App;
