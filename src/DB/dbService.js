

//create
export const create=async({model,data={}})=>{
    const document=await model.create(data);
    return document;
}

// finders
export const find=async({model,filter={},select="",skip=0,limit=1000,populate=[]})=>{
    const document=await model.find(filter).populate(populate).select(select).skip(skip).limit(limit);
    return document;
}


export const findById=async({model,id="",populate=[],select=""})=>{
 const document=await model.findById(id).populate(populate).select(select);
 return document;
}

export const findOne=async({model,filter={},populate=[],select=""})=>{
    const document=await model.findOne(filter).populate(populate).select(select);
    return document;
}

export const findOneAndUpdate=async({model,filter,data={},potions={},select="",populate=[]})=>{
    const document=await model.findOneAndUpdate(filter,data,potions).populate(populate).select(select);
    return document;
}

export const findByIdAndUpdate=async({model,id="",data={},options={},populate=[],select=""})=>{
    const document =await model.findByIdAndUpdate(id,data,options).populate(populate).select(select);
    return document;
}

export const updateOne=async({model,filter={},data={},potions={},select="",populate=[]})=>{
    const document=await model.updateOne(filter,data,potions).populate(populate).select(select);
    return document;
}
export const updateMany=async({model,filter={},data={},potions={},select="",populate=[]})=>{
    const document=await model.updateMany(filter,data,potions).populate(populate).select(select);
    return document;
}

export const findByIdAndDelete=async({model,id="",options={},populate=[],select=""})=>{
    const document=await model.findByIdAndDelete(id,options).populate(populate).select(select);
    return document;
   }
   
   export const findOneAndDelete=async({model,filter={},options={},populate=[],select=""})=>{
       const document=await model.findOneAndDelete(filter,options).populate(populate).select(select);
       return document;
   }
   

   
   export const deleteOne=async({model,filter={},potions={}})=>{
       const document=await model.deleteOne(filter,potions)
       return document;
   }
   export const deleteMany=async({model,filter={},options={}})=>{
       const document=await model.updateMany(filter,options)
       return document;
   }