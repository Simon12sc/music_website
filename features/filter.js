
class ApiFeatures{
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr;
    }

    search(){
        let filter
        if(this.queryStr.name){
            filter={
                ...this.queryStr,
                title:{
                    $regex:this.queryStr.name,
                    $options:"i"
                }
            }
        }else{
            filter={...this.queryStr}
        }

        this.query=this.query.find({...filter});
        return this;

    }


    pagination(resultPerPage){
        const currentPage=+this.queryStr.page || 1
        let skip=resultPerPage * (currentPage-1);
        this.query=this.query.limit(resultPerPage).skip(skip);
        return this;
    }
}

export default ApiFeatures;