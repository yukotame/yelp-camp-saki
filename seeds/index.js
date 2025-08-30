const mongoose = require('mongoose');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const Campground = require('../models/campground');


mongoose.connect('mongodb://localhost:27017/yelp-camp',
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        console.log('MongoDBコネクションOK！！');
    })
    .catch(err => {
        console.log('MongoDBコネクションエラー！！！');
        console.log(err);
    });

    //配列でランダムな要素を返す
    const sample = array=> array[Math.floor(Math.random()*array.length)]



    const seedDB = async () =>{

        await Campground.deleteMany({});
        for(let i = 0 ; i < 50 ; i++){
            const randomCityIndex = Math.floor(Math.random()* cities.length)
            const price = Math.floor(Math.random()*2000) + 1000
            const camp = new Campground({
                author:'68910c19e1524469bc948aad',
                location: `${cities[randomCityIndex].prefecture}${cities[randomCityIndex].city}`,
                title: `${sample(descriptors)}・${sample(places)}`,
                images: [
                         {
                           
                            url: 'https://res.cloudinary.com/dfh8iiael/image/upload/v1754799875/YelpCamp/t4vc55ho28vsso9l49hi.jpg',
                            filename: 'YelpCamp/t4vc55ho28vsso9l49hi'
                            },
                            {
                            
                            url: 'https://res.cloudinary.com/dfh8iiael/image/upload/v1754799875/YelpCamp/makznwsvougog8fonuji.jpg',
                            filename: 'YelpCamp/makznwsvougog8fonuji'
                            }
                        ],
                description:'親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を...',
                geometry:{
                    type:'Point',
                    coordinates:[
                        cities[randomCityIndex].longitude,
                        cities[randomCityIndex].latitude

                    ]
                },
                price
            })
            await camp.save();
        }
        //const c = new Campground({title : 'オートキャンプ'})
        //c.save();
        

    }

    seedDB().then(()=>{
        mongoose.connection.close();
    });