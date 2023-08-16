const utils = {}

utils.generateID = () => {
    const part1 = Date.now().toString(36)
    const part2 = Math.random().toString(36).substring(2)
    return (part1 + part2).substring()
}

utils.generateName = (index, userData) => {
    const name = userData.name.split(' ')[0]
    const nameFinal = `${name}${Date.now().toString(36)}${index}`.toUpperCase()
    return nameFinal
}

utils.generateArrayImages = (objectList) => {
    
    const newList = objectList.map(obj => {
    
        let image = obj.images
        let urlBaseImage = process.env.URL_BUCKET_AWS;            

        if(image){
            const arrayImages = image.split(',')
            
            const arrayImagesURL = arrayImages.map( img => {
                return urlBaseImage + img
            })
            
            image = arrayImagesURL
        }else{
            image = [];
        }

        obj.images = image

        return obj
        
    });

    return newList

}

module.exports = utils