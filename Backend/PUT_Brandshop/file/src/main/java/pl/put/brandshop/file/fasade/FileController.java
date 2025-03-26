package pl.put.brandshop.file.fasade;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.put.brandshop.file.entity.FileResponse;
import pl.put.brandshop.file.mediator.MediatorFile;

@RestController
@RequestMapping(value = "/api/v1/file")
@RequiredArgsConstructor
public class FileController
{

    private final MediatorFile mediatorImage;

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<?> saveFile(@RequestBody MultipartFile multipartFile)
    {
        return mediatorImage.saveFile(multipartFile);
    }

    @RequestMapping(method = RequestMethod.DELETE)
    public ResponseEntity<FileResponse> deleteFile(@RequestParam String uid)
    {
        return mediatorImage.deleteFile(uid);
    }

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<?> getFile(@RequestParam String uid)
    {
        return mediatorImage.getFile(uid);
    }

    @RequestMapping(method = RequestMethod.PATCH)
    public ResponseEntity<FileResponse> activeFile(@RequestParam String uid)
    {
        return mediatorImage.activeFile(uid);
    }

    @RequestMapping(method = RequestMethod.GET,value = "/get-all")
    public ResponseEntity<?> getAllFiles(@RequestParam(required = false,defaultValue = "1") int _page,
                                         @RequestParam(required = false,defaultValue = "10") int _limit)
    {
        return mediatorImage.getFiles(_page,_limit);
    }
}
