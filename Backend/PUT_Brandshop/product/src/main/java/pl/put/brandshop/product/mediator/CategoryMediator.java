package pl.put.brandshop.product.mediator;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import pl.put.brandshop.product.entity.CategoryDTO;
import pl.put.brandshop.product.entity.Response;
import pl.put.brandshop.product.exceptions.ObjectExistInDBException;
import pl.put.brandshop.product.service.CategoryService;
import pl.put.brandshop.product.translator.CategoryToCategoryDTO;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class CategoryMediator
{
    private final CategoryService categoryService;
    private final CategoryToCategoryDTO categoryToCategoryDTO;
    public ResponseEntity<List<CategoryDTO>> getCategory()
    {
        List<CategoryDTO> categoryDTOS = new ArrayList<>();
        categoryService.getCategory().forEach(value -> {categoryDTOS.add(categoryToCategoryDTO.toCategoryDTO(value));});
        return ResponseEntity.ok(categoryDTOS);
    }

    public ResponseEntity<List<CategoryDTO>> getAdminCategory(int page, int limit, String name)
    {
        if((name != null && !name.isEmpty()))
        {
            try
            {
                name = URLDecoder.decode(name, "UTF-8");
            } catch (UnsupportedEncodingException e)
            {
                throw new RuntimeException(e);
            }
        }
        List<CategoryDTO> categoryDTOS = new ArrayList<>();
        categoryService.getAdminCategory(name, page, limit, true).forEach(value -> {categoryDTOS.add(categoryToCategoryDTO.toCategoryDTO(value));});
        long totalCount = categoryService.countActiveCategory(name, true);
        return ResponseEntity.ok().header("X-Total-Count",String.valueOf(totalCount)).body(categoryDTOS);
    }

    public void createCategory(CategoryDTO categoryDTO) throws ObjectExistInDBException
    {
        categoryService.create(categoryDTO);
    }

    public ResponseEntity<Response> deleteCategory(String shortID)
    {
        try
        {
            categoryService.delete(shortID);
            return ResponseEntity.ok(new Response("Successful delete category"));
        }
        catch (RuntimeException e)
        {
            e.printStackTrace();
            return ResponseEntity.status(400).body(new Response("Category dont exist"));
        }
    }
}
