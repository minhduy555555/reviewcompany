
class SiteControllers {
    // [GET] /
    home(req, res, next) {
        res.render("home")
    }
}

module.exports = new SiteControllers();
