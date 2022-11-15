require('dotenv').config()
console.log(process.env.MONGO_URI)

//import mongoose from 'mongoose'; -> ajouter type:"module" dans package.json
const mongoose = require('mongoose');
const {Schema} = mongoose;

const locationSchema = new Schema({
    filmType: String, // String is shorthand for {type: String}
    filmProducerName: String,
    endDate: Date,
    startDate: Date,
    filmName: String,
    district: String,
    geolocation: {
        coordinates:{
            type: [Number]
        },
        type:{
            type:String,
            enum:['Point'],
        }
    },
    sourceLocationId: String,
    filmDirectorName: String,
    address: String,
    year: Number,
});
const Location = mongoose.model('Location', locationSchema);
main();

async function main() {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Well done")
    // async function -> utiliser const result =  await mongoose.connect(etc)
    //const connections = await Promise.all([connect1,connect2]) puis console.log(connections)
    //les promises renvoient une erreur -> faire un try catch pour afficher l'erreur

    //const maPremiereLocation = new Locations({filmType: 'Horror'})
    //await maPremiereLocation.save()
    //console.log("Saved")
    const filmingLocations = require('./lieux-de-tournage-a-paris.json')
    //await loadFilmingLocations(filmingLocations)
    console.log("Done")
    queryLocationById('633f2330e01f0dabb5d19dbe')
    queryAllLocationsByFilmName('LUZ')
    const myTestLoc = new Location({filmName : 'Guigs'})
    addLocation(myTestLoc)
    queryLocationById('63405283321c99402a332779')
    deleteLocationById('63405283321c99402a332779')
    queryLocationById('63405283321c99402a332779')
}

async function loadFilmingLocations(filmingLocations){
    for (const filmingLocation of filmingLocations) {
        //console.log(filmingLocation.fields)
        if(Number.isNaN(Number(filmingLocation.fields.ardt_lieu))){
            console.log(filmingLocation.fields)
        }
        const myLoc = new Location({
            filmType: filmingLocation.fields.type_tournage,
            filmProducerName: filmingLocation.fields.nom_producteur,
            endDate: new Date(filmingLocation.fields.date_fin),
            startDate: new Date(filmingLocation.fields.date_debut),
            filmName: filmingLocation.fields.nom_tournage,
            district: filmingLocation.fields.ardt_lieu,
            geolocation: filmingLocation.fields.geo_shape,
                /*{
                coordinates: [
                    filmingLocation.fields.geo_shape.coordinates[0],
                    filmingLocation.fields.geo_shape.coordinates[1]
                ],
                type: filmingLocation.fields.geo_shape.type,
            },*/
            sourceLocationId: filmingLocation.fields.id_lieu,
            filmDirectorName: filmingLocation.fields.nom_realisateur,
            address: filmingLocation.fields.adresse_lieu,
            year: Number(filmingLocation.fields.annee_tournage),
        });
        await myLoc.save();
    }
    console.log("Saved")
}
function queryLocationById(idInMongo) {
    Location.findById(idInMongo).then(film => console.log(film+"\n"))
}
function queryAllLocationsByFilmName(filmname) {
    Location.find({filmName : filmname}).then(allFilms => allFilms.forEach(film => console.log(film.sourceLocationId)))
    console.log("\n")
}
function deleteLocationById(idInMongo) {
    Location.findOneAndDelete({_id:idInMongo}).then(console.log('Deleted !\n'))
}
function updateLocation(id,set){
    Location.updateOne({_id: id}, {$set:set}).then(console.log('done'))
}
function addLocation(location) {
    try{
        location.save();
    } catch (e) {
        console.log("Couldn't add a location !\n")
    }
}