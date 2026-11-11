export const thermalPath='/phim-cach-nhiet-nha-kinh/';
export const thermalCanonical='https://idecal.vn'+thermalPath;
export const getServicePath=(slug:string)=>slug==='phim-cach-nhiet'?thermalPath:'/dich-vu/'+slug;
export const getMaterialPath=(slug:string)=>['phim-cach-nhiet','phim-cach-nhiet-nha-kinh'].includes(slug)?thermalPath:'/'+slug;
