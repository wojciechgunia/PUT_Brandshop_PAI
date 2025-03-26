package pl.put.brandshop.file.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import pl.put.brandshop.file.entity.FileEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileRepository extends JpaRepository<FileEntity, Long>
{
    Optional<FileEntity> findByUid(String uid);

    @Query(nativeQuery = true,value = "SELECT * FROM image_data WHERE createat < current_date - interval '2 days' and isused = false")
    List<FileEntity> findDontUseImages();
}
