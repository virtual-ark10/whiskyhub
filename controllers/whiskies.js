import Whisky from "../models/whisky.js";


export const indexPage = async(req, res) => {
    const whiskies = await Whisky.find({});
    res.render('whiskies/whiskies', {whiskies})
}

export const newWhisky = async(req, res) => {
    res.render('whiskies/new')
}

export const saveWhisky = async(req, res, next)=> {
    const whisky = new Whisky(req.body.whiskies);
    console.log(whisky)

    whisky.user = req.user._id;
    console.log(whisky)
    await whisky.save();
    req.flash('success', `Successfully added ${whisky.name}`)
    res.redirect(`/whiskies/${whisky._id}`)
}

export const showWhisky = async(req, res) => {
    const whisky = await Whisky.findById(req.params.id).populate({
        path: 'reviews',
        populate: {path: 'user'},
        options: {sort: {createdAt:-1}},
    })
    .populate({
        path: 'user'
    })
    console.log(whisky)
    res.render('whiskies/show', {whisky})
}

export const renderEditPage = async(req, res) => {
    const whisky = await Whisky.findById(req.params.id);
    res.render('whiskies/edit', {whisky})
}

export const editWhisky = async(req, res) => {
    const {id} = req.params;
    const whisky = await Whisky.findByIdAndUpdate(id, {...req.body.whiskies})
    //const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    //whisky.images.push(...imgs);
    await whisky.save();
    res.redirect(`/whiskies/${whisky._id}`)
}

export const deleteWhisky = async(req, res) => {
    const {id} = req.params;
    const whisky = await Whisky.findByIdAndDelete(id);
    req.flash('success', `Successfully deleted ${whisky.name}`)
    res.redirect('/whiskies')
}

export default {
    indexPage, newWhisky, saveWhisky, showWhisky,
    renderEditPage, editWhisky, deleteWhisky
}