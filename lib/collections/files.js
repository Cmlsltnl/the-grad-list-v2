const imgur_client_id = "da4c4d6665e6e38";


function base64_encode(file) {
    // read binary data
    const fs = Npm.require("fs");
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}
this.Images = new FilesCollection({
    collectionName: 'Images', allowClientCode: true,
    onAfterUpload: function (fileRef) {
        _.each(fileRef.versions, function (vRef, version) {
            const output = base64_encode(fileRef.path);

            const options = {
                apiKey: imgur_client_id,
                image: output
            };
            Imgur.upload(options, function (err, data) {
                if (err) {
                    console.error(err);
                    return;
                }
                let upd = {
                    $set: {}
                };
                upd['$set']["versions." + version + ".meta.pipePath"] = data.link;
                upd['$set']["versions." + version + ".meta.deleteHash"] = data.deletehash;
                this.Images.update({
                    _id: fileRef._id
                }, upd, function (error) {
                    if (error) {
                        console.error(error);
                    } else {
                        this.Images.unlink(this.Images.findOne(fileRef._id), version);
                    }
                });
            });
        });
    },
    interceptDownload: function (http, fileRef, version) {
        if(fileRef.versions[version].meta.pipePath) {
            const Request = Npm.require('request');
            Request({
                url: fileRef.versions[version].meta.pipePath,
                headers: _.pick(http.request.headers, 'range', 'accept-language', 'accept', 'cache-control', 'pragma', 'connection', 'upgrade-insecure-requests', 'user-agent')
            }).pipe(http.response);
            return true;
        } else {
            return false;
        }
    }
});

const _origRemove = this.Images.remove;

this.Images.remove = function (search) {
    if (Meteor.isServer) {
        const cursor = this.Images.find(search);
        cursor.forEach(function (fileRef) {
            _.each(fileRef.versions, function (vRef) {
                let ref;
                if (vRef != null ? (ref = vRef.meta) != null ? ref.pipePath : void 0 : void 0) {
                    const options = {
                        apiKey: imgur_client_id,
                        deleteHash: vRef.meta.deleteHash
                    }
                    Imgur.delete(options, function (err, data) {
                        if (err) {
                            console.error(err);
                            return;
                        }
                    });
                }
            });
        });
        _origRemove.call(this, search);
    }
};