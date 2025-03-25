package pl.put.brandshop.product.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import pl.put.brandshop.product.entity.ProductDTO;
import pl.put.brandshop.product.entity.ProductEntity;
import pl.put.brandshop.product.entity.ProductFormDTO;
import pl.put.brandshop.product.repository.CategoryRepository;
import pl.put.brandshop.product.repository.ProductRepository;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService
{
    @Value("${file-service.url}")
    private String FILE_SERVICE;

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @PersistenceContext
    EntityManager entityMenager;

    public long countActiveProducts(String name, String category, Float priceMin, Float priceMax, boolean admin){
        CriteriaBuilder criteriaBuilder = entityMenager.getCriteriaBuilder();
        CriteriaQuery<Long> query = criteriaBuilder.createQuery(Long.class);
        Root<ProductEntity> root = query.from(ProductEntity.class);
        List<Predicate> predicates = prepareQuery(name,category,priceMin,priceMax,criteriaBuilder,root,admin);
        query.select(criteriaBuilder.count(root)).where(predicates.toArray(new Predicate[0]));
        return entityMenager.createQuery(query).getSingleResult();
    }
    public ProductDTO getProductDTO()
    {
        return null;
    }

    public List<ProductEntity> getProduct(String name, String category, Float priceMin, Float priceMax, String data, int page, int limit, String sort, String order, boolean admin)
    {
        CriteriaBuilder criteriaBuilder = entityMenager.getCriteriaBuilder();
        CriteriaQuery<ProductEntity> query = criteriaBuilder.createQuery(ProductEntity.class);
        Root<ProductEntity> root = query.from(ProductEntity.class);

        if (data != null && !data.equals("") && name != null && !name.trim().equals(""))
        {
            DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyyMMdd");
            LocalDate date = LocalDate.parse(data, inputFormatter);
            return productRepository.findByNameAndCreateAt(name, date);
        }
        page=lowerThanOne(page);
        limit=lowerThanOne(limit);
        List<Predicate> predicates = prepareQuery(name,category,priceMin,priceMax,criteriaBuilder,root, admin);

        if(!order.isEmpty() && !sort.isEmpty())
        {
            String column = null;
            switch (sort)
            {
                case "name":
                    column="name";
                    break;

                case "category":
                    column="category";
                    break;

                case "date":
                    column="createAt";
                    break;

                default:
                    column="price";
                    break;
            }
            Order orderQuery;
            if(order.equals("desc"))
            {
                orderQuery = criteriaBuilder.desc(root.get(column));
            }
            else
            {
                orderQuery = criteriaBuilder.asc(root.get(column));
            }
            query.orderBy(orderQuery);
        }

        query.where(predicates.toArray(new Predicate[0]));
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

    private List<Predicate> prepareQuery(String name, String category, Float priceMin, Float priceMax, CriteriaBuilder criteriaBuilder,Root<ProductEntity> root,boolean admin)
    {
        List<Predicate> predicates = new ArrayList<>();
        if(name != null && !name.trim().equals(""))
        {
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
        }
        if(category != null && !category.equals(""))
        {
            categoryRepository.findByShortId(category).
                    ifPresent(value -> predicates.add(criteriaBuilder.equal(root.get("category"), value)));
        }
        if(priceMin != null)
        {
            predicates.add(criteriaBuilder.greaterThan(root.get("price"),priceMin-0.01));
        }
        if(priceMax != null)
        {
            predicates.add(criteriaBuilder.lessThan(root.get("price"),priceMax+0.01));
        }
        predicates.add(criteriaBuilder.isTrue(root.get("activate")));
        return predicates;
    }

    @Transactional
    public void createProduct(ProductEntity productEntity)
    {
        if(productEntity != null)
        {
            productEntity.setCreateAt(LocalDate.now());
            productEntity.setUid(UUID.randomUUID().toString());
            productEntity.setActivate(true);
            System.out.println(productEntity.getId() + " | " + productEntity.getUid() + " | " + productEntity.getName() + " | " + productEntity.getPrice() + " | " + productEntity.getCreateAt() + " | " + productEntity.getParameters() + " | " + productEntity.getMainDesc() + " | " + productEntity.getDescHtml() + " | " + productEntity.isActivate() + " | " + productEntity.getImageUrls() + " | " + productEntity.getCategory().getName() + " | " + productEntity.getCategory().getId()) ;
            productRepository.save(productEntity);
            for (String uid: productEntity.getImageUrls())
            {
                activateImage(uid);
            }
            return;
        }
        throw new RuntimeException();
    }

    private void activateImage(String uid)
    {
        HttpRequest request = HttpRequest.newBuilder().uri(URI.create(FILE_SERVICE+"?uid="+uid)).method("PATCH",HttpRequest.BodyPublishers.noBody()).build();
        try
        {
            HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
        }
        catch (IOException | InterruptedException e)
        {
            throw new RuntimeException(e);
        }
    }

    @Transactional
    public void delete(String uid) throws RuntimeException
    {
        productRepository.findByUid(uid).ifPresentOrElse(value -> {
            value.setActivate(false);
            productRepository.save(value);
//            for(String image: value.getImageUrls())
//            {
//                deleteImages(image);
//            }
        },()->{
            throw new RuntimeException();
        });
    }

    private void deleteImages(String uid)
    {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.delete(FILE_SERVICE+"?uid="+uid);
    }

    public Optional<ProductEntity> getProductByUid(String uid)
    {
        return productRepository.findByUid(uid);
    }

    @Transactional
    public void update(ProductFormDTO productFormDTO, String uid)
    {
        productRepository.findByUid(uid).ifPresentOrElse(value -> {
            if(!productFormDTO.getName().isEmpty()) value.setName(productFormDTO.getName());
            if(productFormDTO.getPrice() != 0) value.setPrice(productFormDTO.getPrice());
            if(!productFormDTO.getMainDesc().isEmpty()) value.setMainDesc(productFormDTO.getMainDesc());
            if(!productFormDTO.getDescHtml().isEmpty()) value.setDescHtml(productFormDTO.getDescHtml());
            if(productFormDTO.getImagesUid().length>0) value.setImageUrls(productFormDTO.getImagesUid());
            if(!productFormDTO.getParameters().isEmpty()) value.setParameters(productFormDTO.getParameters());
            if(!productFormDTO.getCategory().isEmpty())
            {
                this.categoryRepository.findByShortId(productFormDTO.getCategory()).ifPresent(category -> {
                    value.setCategory(category);
                });
            }
            productRepository.save(value);
        },()->{
            throw new RuntimeException();
        });
    }
}
