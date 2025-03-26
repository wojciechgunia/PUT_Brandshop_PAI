package pl.put.brandshop.file.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import pl.put.brandshop.file.entity.FileEntity;
import pl.put.brandshop.file.repository.FileRepository;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
@EnableScheduling
@RequiredArgsConstructor
public class FileService
{
    private final FileRepository fileRepository;
    private final FTPService ftpService;

    @PersistenceContext
    EntityManager entityMenager;

    public FileEntity save(FileEntity fileEntity)
    {
        return fileRepository.saveAndFlush(fileEntity);
    }

    public FileEntity findByUid(String uid)
    {
        return fileRepository.findByUid(uid).orElse(null);
    }

    @Scheduled(cron = "0 0 1 * * ?")
    public  void cleanImages()
    {
        fileRepository.findDontUseImages().forEach(value ->{
            try
            {
                ftpService.deleteFile(value.getPath());
                fileRepository.delete(value);
            }
            catch (IOException e)
            {
                System.out.println("Cant delete "+value.getUid());
            }
        });
    }

    public List<FileEntity> getFiles(int page, int limit)
    {
        CriteriaBuilder criteriaBuilder = entityMenager.getCriteriaBuilder();
        CriteriaQuery<FileEntity> query = criteriaBuilder.createQuery(FileEntity.class);
        Root<FileEntity> root = query.from(FileEntity.class);
        page=lowerThanOne(page);
        limit=lowerThanOne(limit);
        String column = "createAt";
        Order orderQuery = criteriaBuilder.desc(root.get(column));
        query.orderBy(orderQuery);
        return entityMenager.createQuery(query).setFirstResult((page-1)*limit).setMaxResults(limit).getResultList();
    }

    private int lowerThanOne(int number)
    {
        if(number<1)
        {
            return 1;
        }
        return number;
    }

    public long countFiles()
    {
        CriteriaBuilder criteriaBuilder = entityMenager.getCriteriaBuilder();
        CriteriaQuery<Long> query = criteriaBuilder.createQuery(Long.class);
        Root<FileEntity> root = query.from(FileEntity.class);
        query.select(criteriaBuilder.count(root));
        return entityMenager.createQuery(query).getSingleResult();
    }
}
