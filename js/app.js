/**
 * Les données
 */
// Objet geojson des départements de l'Ile-de-France
var departements = JSON.parse(departementsJson);

//  =============================================    Partie 1  ==============================================================
var departementsFeatures = new ol.format.GeoJSON().readFeatures(departements, {
    featureProjection: "EPSG:3857",
});

/**
 * instancier la carte openlayers
 */
const map = new ol.Map({
    // l'id de l'element html de la carte
    target: "map",
    // les couches de la carte
    layers: [
        // premiere couche : Nouvelle couche tuilée OSM
        new ol.layer.Tile({
            source: new ol.source.OSM(),
        }),
    ],
    // la vue initiale de la carte: centre de l'ile de france en WGS84
    view: new ol.View({
        center: ol.proj.fromLonLat([2.496598, 48.717541]),
        zoom: 8.7,
    }),
    // Tableau des contrôles de la carte
    controls: ol.control.defaults().extend([
        // Echelle linéaire
        new ol.control.ScaleLine(),
    ]),
});

// Création d'une nouvelle vecteur
var departementsSource = new ol.source.Vector({
    features: departementsFeatures,
});

// initialization des coleurs
var colors = [
    "#1D5B79",
    "#468B97",
    "#F3AA60",
    "#EF6262",
    "#A2FF86",
    "#8EAC50",
    "#D3D04F",
    "#F99B7D",
];

/** map des coulers code -> color
 * {"77" => "#1D5B79"}
 * {"78" => "#468B97"}
 * {"94" => "#F3AA60"}
 * {"92" => "#EF6262"}
 * {"75" => "#A2FF86"}
 * {"95" => "#8EAC50"}
 * {"91" => "#D3D04F"}
 * {"93" => "#F99B7D"}}
 */
var departementColorMap = new Map();
for (var i = 0; i < departements.features.length; i++) {
    var departmentCode = departements.features[i].properties.code_dept;
    departementColorMap.set(departmentCode, colors[i]);
}

// styles
var styleDepartement = function (feature) {
    // Récupération de code departement
    var departementCode = feature.get("code_dept");

    // couleur de departement
    var departementColor = departementColorMap.get(departementCode);

    // Retourne l'objet Style avec les propriétés définies
    return new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: "#808080",
            width: 1,
        }),
        fill: new ol.style.Fill({
            color: departementColor,
        }),
    });
};

// Création de la couche departements avec sa source et son style
var departementsLayer = new ol.layer.Vector({
    source: departementsSource,
    style: styleDepartement,
});

departementsLayer.setOpacity(0.7);
departementsLayer.setVisible(false);

map.addLayer(departementsLayer);

/**
 * Ajouter l'évenement au checkbox departements-idf ==========================================
 */
var departementsCheckBox = document.getElementById("departements-idf");
departementsCheckBox.addEventListener("click", function (event) {
    departementsLayer.setVisible(event.target.checked);
});

//  =============================================    Partie 2  ==============================================================
/**
 * déclaration de classe City
 */
class City {
    // le constructeur
    constructor(name, code, population, lat, lon) {
        // les paramétres
        this.name = name;
        this.code = code;
        this.population = population;
        this.lat = lat;
        this.lon = lon;
    }

    // les méthodes
    getDescription() {
        return this.name + ": " + "Population: " + this.population + " habitants.";
    }
    getPosition() {
        return {
            lat: this.lat,
            lon: this.lon,
        };
    }
}

// Init les villes
var paris = new City("Paris", 75, 2206488, 48.85349, 2.34839);
var boulogneBillancourt = new City(
    "Boulogne-Billancourt",
    92,
    48.8353,
    2.2412
);
var saintDenis = new City("Saint-Denis", 93, 111103, 48.93577, 2.35802);
var argenteuil = new City("Argenteuil", 95, 110388, 48.94781, 2.24928);
var montreuil = new City("Montreuil", 93, 106691, 48.86233, 2.44121);
var nanterre = new City("Nanterre", 92, 93742, 48.89243, 2.20732);
var vitrySurSeine = new City("Vitry-sur-Seine", 94, 92531, 48.78755, 2.39221);
var creteil = new City("Créteil", 94, 90739, 48.77703, 2.45315);
var asnieresSurSeine = new City(
    "Asnières-sur-Seine",
    92,
    86512,
    48.91071,
    2.2891
);
var versailles = new City("Versailles", 78, 85771, 48.80329, 2.1269);
var colombes = new City("Colombes", 92, 85199, 48.92286, 2.25447);
var aubervilliers = new City("Aubervilliers", 93, 83782, 48.9144, 2.38222);
var aulnaySousBois = new City("Aulnay-sous-Bois", 93, 83584, 48.93404, 2.50005);
var courbevoie = new City("Courbevoie", 92, 83136, 48.8953, 2.25613);
var rueilMalmaison = new City("Rueil-Malmaison", 92, 78794, 48.87765, 2.18024);

var cities = [
    paris,
    boulogneBillancourt,
    saintDenis,
    argenteuil,
    montreuil,
    nanterre,
    vitrySurSeine,
    creteil,
    asnieresSurSeine,
    versailles,
    colombes,
    aubervilliers,
    aulnaySousBois,
    courbevoie,
    rueilMalmaison,
];

/**
 * Créer la Nouvelle couche vecteur ==================================================
 */

//Créer le style des points
var iconStyle = new ol.style.Style({
    image: new ol.style.Icon({
        anchor: [0.5, 1],
        src: "img/points_villes.svg",
        scale: 0.25,
    }),
});

// Transformer la liste
var cityFeatures = [];
for (var city of cities) {
    var lon = city.lon;
    var lat = city.lat;
    var coords = [lon, lat];
    var projectedCoords = ol.proj.fromLonLat(coords);
    // Objet de type ol.Feature instancié avec une géométrie, un nom...
    var feature = new ol.Feature({
        geometry: new ol.geom.Point(projectedCoords),
        name: city.name,
        details: city.getDescription(),
    });
    // ajouter le style
    feature.setStyle(iconStyle);
    // ajouter à la liste des features
    cityFeatures.push(feature);
}


// la source des données de type vecteur
var citiesLayerSource = new ol.source.Vector({
    // la liste des features
    features: cityFeatures,
});

// la couche de type vecteur (à partir de la source des données)
var citiesLayer = new ol.layer.Vector({
    // la source des données de type vecteur
    source: citiesLayerSource,
});

// couche invisible au démarrage
citiesLayer.setVisible(false);

// ajouter la couche à la carte
map.addLayer(citiesLayer);

var citiesCheckBox = document.getElementById("cities");
citiesCheckBox.addEventListener("click", function (event) {
    citiesLayer.setVisible(event.target.checked);
});
