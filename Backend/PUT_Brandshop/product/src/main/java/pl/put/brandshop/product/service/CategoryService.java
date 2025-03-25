package pl.put.brandshop.product.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.put.brandshop.product.entity.Category;
import pl.put.brandshop.product.entity.CategoryDTO;
import pl.put.brandshop.product.entity.ProductDTO;
import pl.put.brandshop.product.entity.ProductEntity;
import pl.put.brandshop.product.exceptions.ObjectExistInDBException;
import pl.put.brandshop.product.repository.CategoryRepository;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CategoryService
{
    private final CategoryRepository categoryRepository;
    @PersistenceContext
    EntityManager entityMenager;


    public long countActiveCategory(String name, boolean admin){
        CriteriaBuilder criteriaBuilder = entityMenager.getCriteriaBuilder();
        CriteriaQuery<Long> query = criteriaBuilder.createQuery(Long.class);
        Root<Category> root = query.from(Category.class);
        List<Predicate> predicates = prepareQuery(name,criteriaBuilder,root,admin);
        query.select(criteriaBuilder.count(root)).where(predicates.toArray(new Predicate[0]));
        return entityMenager.createQuery(query).getSingleResult();
    }

    public List<Category> getAdminCategory(String name, int page, int limit, boolean admin)
    {
        CriteriaBuilder criteriaBuilder = entityMenager.getCriteriaBuilder();
        CriteriaQuery<Category> query = criteriaBuilder.createQuery(Category.class);
        Root<Category> root = query.from(Category.class);

        page=lowerThanOne(page);
        limit=lowerThanOne(limit);
        List<Predicate> predicates = prepareQuery(name,criteriaBuilder,root, admin);

        String column = "name";
        Order orderQuery;
        orderQuery = criteriaBuilder.asc(root.get(column));
        query.orderBy(orderQuery);

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

    private List<Predicate> prepareQuery(String name, CriteriaBuilder criteriaBuilder,Root<Category> root,boolean admin)
    {
        List<Predicate> predicates = new ArrayList<>();
        if(name != null && !name.trim().equals(""))
        {
            predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + name.toLowerCase() + "%"));
        }
        predicates.add(criteriaBuilder.isTrue(root.get("activate")));
        return predicates;
    }
    public List<Category> getCategory()
    {
        return categoryRepository.findAllByActivate(true);
    }

    public void create(CategoryDTO categoryDTO) throws ObjectExistInDBException
    {
        Category category = new Category();
        category.setName(categoryDTO.getName());
        category.setShortId(UUID.randomUUID().toString().replace("-","").substring(0,12));
        category.setActivate(true);

        categoryRepository.findByName(category.getName()).ifPresent(value -> {
            throw new ObjectExistInDBException("Category exist with this name");
        });
        categoryRepository.save(category);
    }

    public Optional<Category> findCategoryByShortID(String shortId)
    {
        return categoryRepository.findByShortId(shortId);
    }

    @Transactional
    public void delete(String shortId) throws RuntimeException
    {
        categoryRepository.findByShortId(shortId).ifPresentOrElse(value -> {
            value.setActivate(false);
            categoryRepository.save(value);
        },()->{
            throw new RuntimeException();
        });
    }
}
