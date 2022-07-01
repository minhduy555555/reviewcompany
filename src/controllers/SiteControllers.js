
class SiteControllers{
    home(req, res, next) {
        res.send("đây là test")
    }
}

module.exports = new SiteControllers