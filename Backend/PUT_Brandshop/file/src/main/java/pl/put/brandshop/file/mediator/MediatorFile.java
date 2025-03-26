package pl.put.brandshop.file.mediator;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import pl.put.brandshop.file.entity.FileDTO;
import pl.put.brandshop.file.entity.FileEntity;
import pl.put.brandshop.file.entity.FileResponse;
import pl.put.brandshop.file.entity.FilesDTO;
import pl.put.brandshop.file.exceptions.FtpConnectionException;
import pl.put.brandshop.file.service.FTPService;
import pl.put.brandshop.file.service.FileService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
@AllArgsConstructor
public class MediatorFile
{
    private final FTPService ftpService;
    private final FileService fileService;

    public ResponseEntity<?> saveFile(MultipartFile multipartFile)
    {
        try
        {
            String type = multipartFile.getOriginalFilename().substring(multipartFile.getOriginalFilename().lastIndexOf(".")+1);
            if(type.equals("png") || type.equals("jpg") || type.equals("PNG") || type.equals("pdf"))
            {
                System.out.println(type);
                FileEntity fileEntity = ftpService.uploadFileToFTP(multipartFile);
                fileService.save(fileEntity);
                return ResponseEntity.ok(FileDTO.builder().uid(fileEntity.getUid()).createAt(fileEntity.getCreateAt()).build());
            }
            return ResponseEntity.status(400).body(new FileResponse("Wrong file type"));
        }
        catch (IOException e)
        {
            return ResponseEntity.status(400).body(new FileResponse("File don't exist"));
        }
        catch (FtpConnectionException e1)
        {
            return ResponseEntity.status(400).body(new FileResponse("File couldn't be saved"));
        }
    }

    public ResponseEntity<FileResponse> deleteFile(String uid)
    {
        try
        {
            FileEntity fileEntity = fileService.findByUid(uid);
            if (fileEntity != null)
            {
                ftpService.deleteFile(fileEntity.getPath());
                return ResponseEntity.ok(new FileResponse("File deleted success"));
            }
            else
            {
                throw new IOException("File don't exist");
            }

        }
        catch (IOException e)
        {
            return ResponseEntity.status(400).body(new FileResponse("File don't exist"));
        }
        catch (FtpConnectionException e1)
        {
            return ResponseEntity.status(400).body(new FileResponse("File couldn't be deleted"));
        }

    }

    public ResponseEntity<?> getFile(String uid)
    {
        try
        {
            FileEntity fileEntity = fileService.findByUid(uid);
            if (fileEntity != null)
            {
                String type = fileEntity.getPath().substring(fileEntity.getPath().lastIndexOf(".")+1);
                HttpHeaders headers = new HttpHeaders();
                if ( type.equals("png") || type.equals("PNG"))
                    headers.setContentType(MediaType.IMAGE_PNG);
                if ( type.equals("jpg"))
                    headers.setContentType(MediaType.IMAGE_JPEG);
                if ( type.equals("pdf"))
                    headers.setContentType(MediaType.APPLICATION_PDF);
                return new ResponseEntity<>(ftpService.getFile(fileEntity).toByteArray(),headers, HttpStatus.OK);
            }
            else
            {
                throw new IOException("File don't exist");
            }

        }
        catch (IOException e)
        {
            return ResponseEntity.status(400).body(new FileResponse("File don't exist"));
        }
        catch (FtpConnectionException e1)
        {
            return ResponseEntity.status(400).body(new FileResponse("File couldn't be downloaded"));
        }
    }

    public ResponseEntity<FileResponse> activeFile(String uid)
    {
        FileEntity fileEntity = fileService.findByUid(uid);
        if (fileEntity != null)
        {
            fileEntity.setUsed(true);
            fileService.save(fileEntity);
            return ResponseEntity.ok(new FileResponse("File successfuly activated"));
        }
        else
        {
            return ResponseEntity.status(400).body(new FileResponse("File don't exist"));
        }
    }

    public ResponseEntity<?> getFiles(int page, int limit)
    {
        List<FileEntity> products = fileService.getFiles(page, limit);
        List<FileDTO> fileDTOS = new ArrayList<>();
        products.forEach(value -> {
            fileDTOS.add(new FileDTO(value.getUid(), value.getCreateAt()));
        });
        long totalCount = fileService.countFiles();
        FilesDTO filesDTO = new FilesDTO(fileDTOS);
        return ResponseEntity.ok().header("X-Total-Count",String.valueOf(totalCount)).body(filesDTO);
    }
}
