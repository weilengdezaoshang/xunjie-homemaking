import Http from "../utils/http";

class Category {
    static getCategotyList () {
        return Http.request({
            url:'v1/category'
        })
    }

    static async getCategoryListWithAll () {
        let categoryList = await Category.getCategotyList()
        categoryList.unshift({id: 0,name: '全部'})
        return categoryList;
    }

}

export default Category