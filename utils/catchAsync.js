//helps avoid using try/catch
export default func => {
    return (req, res, next) => {
        func(req, res, next). catch(next);
    }
}