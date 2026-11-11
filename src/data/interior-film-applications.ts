import source from './interior-film-original.json';
import elevator from './elevator-service.json';

// Keep the imported application copy intact; add the requested elevator feature.
export const interiorFilmApplications=[
  {
    id:'thang-may',
    title:'Thang máy',
    heading:'Làm mới thang máy bằng film nội thất',
    featured:true,
    description:elevator.solutions[0].intro,
    points:elevator.solutions[0].points,
    image:elevator.gallery[0],
    caption:elevator.gallery[0].caption,
    blocks:[],
    links:[{label:'Xem dịch vụ dán thang máy',href:'/dan-decal-thang-may/'}],
  },
  ...source.applications.items.map((item,index)=>({
    ...item,
    id:String(index),
    heading:item.title,
    featured:false,
    description:'',
    points:[] as string[],
    caption:'',
  })),
];
